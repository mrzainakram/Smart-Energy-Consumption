import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import warnings
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler, StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error, confusion_matrix
from sklearn.cluster import KMeans

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, SimpleRNN, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

warnings.filterwarnings('ignore')
np.random.seed(42)
tf.random.set_seed(42)

DATASET_DIR = '/kaggle/input/house-hold-csv'
MODEL_DIR = '/kaggle/working/model'
VISUALIZATION_DIR = '/kaggle/working/model/visualizations'
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(VISUALIZATION_DIR, exist_ok=True)

def load_and_prepare_data(sample_fraction=1.0):
    """Load data with optional sampling to reduce dataset size"""
    files = [
        "cleaned_house1.csv",
        "cleaned_house2.csv",
        "cleaned_house3.csv",
        "cleaned_house4.csv",
        "cleaned_house5.csv"
    ]
    dfs = []
    for idx, file in enumerate(files, 1):
        path = os.path.join(DATASET_DIR, file)
        if os.path.exists(path):
            # Read only a sample of the data if sample_fraction < 1.0
            if sample_fraction < 1.0:
                # First get the total rows
                total_rows = sum(1 for _ in open(path)) - 1  # -1 for header
                # Calculate how many rows to skip
                sample_size = int(total_rows * sample_fraction)
                skip_rows = sorted(np.random.choice(range(1, total_rows + 1), 
                                                  total_rows - sample_size, 
                                                  replace=False))
                df = pd.read_csv(path, skiprows=skip_rows)
            else:
                df = pd.read_csv(path)
                
            if 'house_id' not in df.columns:
                df['house_id'] = idx
            dfs.append(df)
            
    if not dfs:
        raise FileNotFoundError(f"No data files found in dataset directory: {DATASET_DIR}")
    
    df = pd.concat(dfs, ignore_index=True)
    df['Date_Time'] = pd.to_datetime(df['Date_Time'])
    df = df.drop_duplicates()
    df = df.sort_values(['house_id', 'Date_Time'])
    
    print(f"Loaded {len(df)} rows of data")
    return df

def preprocess_data(df):
    print("Preprocessing data...")
    # Extract time features
    df['Year'] = df['Date_Time'].dt.year
    df['Month'] = df['Date_Time'].dt.month
    df['Day'] = df['Date_Time'].dt.day
    df['Hour'] = df['Date_Time'].dt.hour
    df['DayOfWeek'] = df['Date_Time'].dt.dayofweek
    df['Is_Weekend'] = df['DayOfWeek'].apply(lambda x: 1 if x >= 5 else 0)
    
    # Handle missing values
    for col in df.columns:
        if df[col].isna().sum() > 0:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    # Clip outliers
    Q1 = df['Usage_kW'].quantile(0.01)
    Q3 = df['Usage_kW'].quantile(0.99)
    df['Usage_kW'] = df['Usage_kW'].clip(Q1, Q3)
    
    # Cyclical features
    df['Hour_Sin'] = np.sin(2 * np.pi * df['Hour'] / 24)
    df['Hour_Cos'] = np.cos(2 * np.pi * df['Hour'] / 24)
    df['Month_Sin'] = np.sin(2 * np.pi * df['Month'] / 12)
    df['Month_Cos'] = np.cos(2 * np.pi * df['Month'] / 12)
    df['DayOfWeek_Sin'] = np.sin(2 * np.pi * df['DayOfWeek'] / 7)
    df['DayOfWeek_Cos'] = np.cos(2 * np.pi * df['DayOfWeek'] / 7)
    
    # Additional features
    df['Season'] = df['Month'].apply(lambda x: 1 if 3 <= x <= 5 else 2 if 6 <= x <= 8 else 3 if 9 <= x <= 11 else 4)
    df['Is_Peak_Hour'] = df['Hour'].apply(lambda x: 1 if (7 <= x <= 9) or (17 <= x <= 21) else 0)
    
    # Create lag features - more efficiently
    print("Creating lag features...")
    house_ids = df['house_id'].unique()
    
    # Process each house separately to create lag features
    lag_dfs = []
    for house_id in house_ids:
        house_df = df[df['house_id'] == house_id].sort_values('Date_Time').copy()
        
        # Create lag features
        house_df['Usage_kW_Lag1'] = house_df['Usage_kW'].shift(1)
        house_df['Usage_kW_Lag24'] = house_df['Usage_kW'].shift(24)
        house_df['Rolling_Mean_3h'] = house_df['Usage_kW'].rolling(window=3).mean()
        house_df['Rolling_Mean_24h'] = house_df['Usage_kW'].rolling(window=24).mean()
        
        lag_dfs.append(house_df)
    
    # Recombine the dataframes
    df = pd.concat(lag_dfs)
    
    # Fill NaN in lag features
    lag_cols = ['Usage_kW_Lag1', 'Usage_kW_Lag24', 'Rolling_Mean_3h', 'Rolling_Mean_24h']
    for col in lag_cols:
        df[col] = df[col].fillna(df[col].median())
    
    # Drop the timestamp column
    df = df.drop('Date_Time', axis=1)
    
    return df

def train_models():
    # Use only 20% of the data to speed up training
    print("Loading data (20% sample)...")
    df = load_and_prepare_data(sample_fraction=0.2)
    df = preprocess_data(df)
    
    print(f"Dataset shape after sampling: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    
    # Split features and target
    y = df['Usage_kW']
    X = df.drop('Usage_kW', axis=1)

    # Skip K-means clustering to save time
    print("Skipping KMeans clustering to save time...")

    # Split: 80% train, 10% val, 10% test (stratified by house_id)
    print("Splitting data...")
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42, stratify=X['house_id'])
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=X_temp['house_id'])

    # Scaling
    print("Scaling data...")
    feature_scaler = RobustScaler()
    X_train_scaled = feature_scaler.fit_transform(X_train)
    X_val_scaled = feature_scaler.transform(X_val)
    X_test_scaled = feature_scaler.transform(X_test)
    
    target_scaler = RobustScaler()
    y_train_scaled = target_scaler.fit_transform(y_train.values.reshape(-1, 1))
    y_val_scaled = target_scaler.transform(y_val.values.reshape(-1, 1))
    y_test_scaled = target_scaler.transform(y_test.values.reshape(-1, 1))
    
    y_train_orig = y_train.values.reshape(-1, 1)
    y_val_orig = y_val.values.reshape(-1, 1)
    y_test_orig = y_test.values.reshape(-1, 1)

    # LSTM - with reduced complexity
    print("\nPreparing LSTM data...")
    X_train_lstm = X_train_scaled.reshape((X_train_scaled.shape[0], 1, X_train_scaled.shape[1]))
    X_val_lstm = X_val_scaled.reshape((X_val_scaled.shape[0], 1, X_val_scaled.shape[1]))
    X_test_lstm = X_test_scaled.reshape((X_test_scaled.shape[0], 1, X_test_scaled.shape[1]))
    
    print("Training LSTM model...")
    lstm_model = Sequential([
        LSTM(32, input_shape=(X_train_lstm.shape[1], X_train_lstm.shape[2]), activation='relu'),
        BatchNormalization(),
        Dropout(0.2),
        Dense(16, activation='relu'),  # Reduced size
        BatchNormalization(),
        Dropout(0.1),
        Dense(1, activation='linear')
    ])
    
    lstm_model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    
    lstm_history = lstm_model.fit(
        X_train_lstm, y_train_scaled, 
        epochs=5,
        batch_size=128,  # Increased for faster training
        validation_data=(X_val_lstm, y_val_scaled),
        callbacks=[
            EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=0.0001, verbose=1)
        ],
        verbose=1
    )
    
    lstm_model.save(os.path.join(MODEL_DIR, 'lstm_model.keras'))

    # Simple RNN - with reduced complexity
    print("\nPreparing RNN data...")
    X_train_rnn = X_train_lstm  # Reuse the same shape
    X_val_rnn = X_val_lstm
    X_test_rnn = X_test_lstm
    
    print("Training Simple RNN model...")
    rnn_model = Sequential([
        SimpleRNN(32, input_shape=(X_train_rnn.shape[1], X_train_rnn.shape[2]), activation='relu'),
        BatchNormalization(),
        Dropout(0.2),
        Dense(16, activation='relu'),  # Reduced size
        BatchNormalization(),
        Dropout(0.1),
        Dense(1, activation='linear')
    ])
    
    rnn_model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    
    rnn_history = rnn_model.fit(
        X_train_rnn, y_train_scaled, 
        epochs=5,
        batch_size=128,  # Increased for faster training
        validation_data=(X_val_rnn, y_val_scaled),
        callbacks=[
            EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=0.0001, verbose=1)
        ],
        verbose=1
    )
    
    rnn_model.save(os.path.join(MODEL_DIR, 'rnn_model.keras'))

    # Random Forest - with reduced complexity
    print("\nTraining Random Forest model...")
    # Reduced number of estimators and depth for faster training
    rf = RandomForestRegressor(
        random_state=42, 
        n_jobs=-1, 
        n_estimators=50,  # Reduced from 200
        max_depth=10,     # Reduced from 20
        verbose=1
    )
    rf.fit(X_train_scaled, y_train_scaled.ravel())
    joblib.dump(rf, os.path.join(MODEL_DIR, 'rf_model.pkl'))

    # Gradient Boosting - with reduced complexity
    print("\nTraining Gradient Boosting model...")
    gb = GradientBoostingRegressor(
        random_state=42, 
        n_estimators=50,  # Reduced from 200
        learning_rate=0.1,
        max_depth=3,      # Reduced from 5
        subsample=0.8,    # Added subsampling for faster training
        verbose=1
    )
    gb.fit(X_train_scaled, y_train_scaled.ravel())
    joblib.dump(gb, os.path.join(MODEL_DIR, 'gb_model.pkl'))

    # Linear Regression
    print("\nTraining Linear Regression model...")
    lr_model = LinearRegression(n_jobs=-1)
    lr_model.fit(X_train_scaled, y_train_scaled.ravel())
    joblib.dump(lr_model, os.path.join(MODEL_DIR, 'lr_model.pkl'))

    # Create dictionary of models for evaluation
    models = {'lstm': lstm_model, 'rf': rf, 'gb': gb, 'rnn': rnn_model, 'lr': lr_model}
    model_names = list(models.keys())
    metrics = {}
    histories = {'lstm': lstm_history, 'rnn': rnn_history}

    # Evaluation
    print("\nEvaluating all models...")
    for name, model in models.items():
        print(f"Evaluating {name.upper()} model...")
        if name == 'lstm':
            train_pred = model.predict(X_train_lstm, verbose=0)
            val_pred = model.predict(X_val_lstm, verbose=0)
            test_pred = model.predict(X_test_lstm, verbose=0)
        elif name == 'rnn':
            train_pred = model.predict(X_train_rnn, verbose=0)
            val_pred = model.predict(X_val_rnn, verbose=0)
            test_pred = model.predict(X_test_rnn, verbose=0)
        else:
            train_pred = model.predict(X_train_scaled).reshape(-1, 1)
            val_pred = model.predict(X_val_scaled).reshape(-1, 1)
            test_pred = model.predict(X_test_scaled).reshape(-1, 1)
        
        # Convert predictions back to original scale
        train_pred_orig = target_scaler.inverse_transform(train_pred)
        val_pred_orig = target_scaler.inverse_transform(val_pred)
        test_pred_orig = target_scaler.inverse_transform(test_pred)
        
        # Calculate regression metrics
        train_rmse = np.sqrt(mean_squared_error(y_train_orig, train_pred_orig))
        val_rmse = np.sqrt(mean_squared_error(y_val_orig, val_pred_orig))
        test_rmse = np.sqrt(mean_squared_error(y_test_orig, test_pred_orig))
        
        train_mae = mean_absolute_error(y_train_orig, train_pred_orig)
        val_mae = mean_absolute_error(y_val_orig, val_pred_orig)
        test_mae = mean_absolute_error(y_test_orig, test_pred_orig)
        
        train_r2 = r2_score(y_train_orig, train_pred_orig)
        val_r2 = r2_score(y_val_orig, val_pred_orig)
        test_r2 = r2_score(y_test_orig, test_pred_orig)
        
        # Calculate classification metrics (high/low usage)
        threshold = np.median(y_test_orig)
        y_test_bin = (y_test_orig > threshold).astype(int)
        y_pred_bin = (test_pred_orig > threshold).astype(int)
        
        cm = confusion_matrix(y_test_bin, y_pred_bin)
        tp = np.sum((y_pred_bin == 1) & (y_test_bin == 1))
        fp = np.sum((y_pred_bin == 1) & (y_test_bin == 0))
        fn = np.sum((y_pred_bin == 0) & (y_test_bin == 1))
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        
        # Store metrics
        metrics[name] = {
            'train': {'rmse': train_rmse, 'mae': train_mae, 'r2': train_r2},
            'val': {'rmse': val_rmse, 'mae': val_mae, 'r2': val_r2},
            'test': {
                'rmse': test_rmse, 'mae': test_mae, 'r2': test_r2,
                'f1': f1, 'precision': precision, 'recall': recall, 
                'confusion_matrix': cm,
                'actual': y_test_orig, 'predictions': test_pred_orig
            }
        }

    # Ensemble
    print("\nCreating ensemble model...")
    val_r2s = np.array([max(0.01, metrics[n]['val']['r2']) for n in model_names])
    weights = val_r2s / val_r2s.sum()
    
    print(f"Model weights: {dict(zip(model_names, weights))}")
    
    test_preds = np.zeros_like(metrics['lstm']['test']['predictions'])
    for i, n in enumerate(model_names):
        test_preds += weights[i] * metrics[n]['test']['predictions']
    
    # Calculate ensemble metrics
    test_rmse = np.sqrt(mean_squared_error(y_test_orig, test_preds))
    test_mae = mean_absolute_error(y_test_orig, test_preds)
    test_r2 = r2_score(y_test_orig, test_preds)
    
    threshold = np.median(y_test_orig)
    y_test_bin = (y_test_orig > threshold).astype(int)
    y_pred_bin = (test_preds > threshold).astype(int)
    
    cm = confusion_matrix(y_test_bin, y_pred_bin)
    tp = np.sum((y_pred_bin == 1) & (y_test_bin == 1))
    fp = np.sum((y_pred_bin == 1) & (y_test_bin == 0))
    fn = np.sum((y_pred_bin == 0) & (y_test_bin == 1))
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    metrics['ensemble'] = {
        'test': {
            'rmse': test_rmse, 'mae': test_mae, 'r2': test_r2,
            'f1': f1, 'precision': precision, 'recall': recall, 
            'confusion_matrix': cm,
            'actual': y_test_orig, 'predictions': test_preds
        }
    }

    # Visualizations
    print("\nGenerating visualizations...")
    
    # 1. Loss curves for LSTM and RNN
    plt.figure(figsize=(16, 6))
    
    # LSTM
    plt.subplot(1, 2, 1)
    plt.plot(lstm_history.history['loss'], label='Train Loss')
    plt.plot(lstm_history.history['val_loss'], label='Val Loss')
    plt.title('LSTM Training vs Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss (MSE)')
    plt.legend()
    plt.grid(True)
    
    # RNN
    plt.subplot(1, 2, 2)
    plt.plot(rnn_history.history['loss'], label='Train Loss')
    plt.plot(rnn_history.history['val_loss'], label='Val Loss')
    plt.title('RNN Training vs Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss (MSE)')
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(os.path.join(VISUALIZATION_DIR, 'deep_learning_loss_curves.png'))
    plt.close()
    
    # 2. Actual vs Predicted for each model
    for name in model_names + ['ensemble']:
        plt.figure(figsize=(12, 6))
        actual = metrics[name]['test']['actual'].flatten()
        pred = metrics[name]['test']['predictions'].flatten()
        
        # Time series plot - first 100 samples
        sample_size = min(100, len(actual))
        plt.plot(actual[:sample_size], label='Actual', color='blue')
        plt.plot(pred[:sample_size], label='Predicted', color='red')
        
        plt.title(f'{name.upper()} Actual vs Predicted (R² = {metrics[name]["test"]["r2"]:.4f})')
        plt.xlabel('Sample')
        plt.ylabel('Usage_kW')
        plt.legend()
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(os.path.join(VISUALIZATION_DIR, f'{name}_actual_vs_predicted.png'))
        plt.close()
        
        # Scatter plot
        plt.figure(figsize=(10, 6))
        plt.scatter(actual, pred, alpha=0.5)
        min_val = min(actual.min(), pred.min())
        max_val = max(actual.max(), pred.max())
        plt.plot([min_val, max_val], [min_val, max_val], 'r--')
        plt.title(f'{name.upper()} Scatter Plot (R² = {metrics[name]["test"]["r2"]:.4f})')
        plt.xlabel('Actual')
        plt.ylabel('Predicted')
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(os.path.join(VISUALIZATION_DIR, f'{name}_scatter_plot.png'))
        plt.close()
        
        # Confusion matrix
        plt.figure(figsize=(8, 6))
        sns.heatmap(metrics[name]['test']['confusion_matrix'], annot=True, fmt='d', cmap='Blues')
        plt.title(f'{name.upper()} Confusion Matrix (High/Low Usage)')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.tight_layout()
        plt.savefig(os.path.join(VISUALIZATION_DIR, f'{name}_confusion_matrix.png'))
        plt.close()

    # 3. Metrics comparison
    plt.figure(figsize=(14, 8))
    bar_names = model_names + ['ensemble']
    rmse = [metrics[n]['test']['rmse'] for n in bar_names]
    mae = [metrics[n]['test']['mae'] for n in bar_names]
    r2 = [metrics[n]['test']['r2'] for n in bar_names]
    
    x = np.arange(len(bar_names))
    width = 0.25
    
    plt.bar(x - width, rmse, width, label='RMSE')
    plt.bar(x, mae, width, label='MAE')
    plt.bar(x + width, r2, width, label='R²')
    
    plt.xticks(x, [n.upper() for n in bar_names])
    plt.legend()
    plt.title('Test Metrics Comparison')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(VISUALIZATION_DIR, 'test_metrics_comparison.png'))
    plt.close()
    
    # 4. Classification metrics comparison
    plt.figure(figsize=(14, 8))
    f1_scores = [metrics[n]['test']['f1'] for n in bar_names]
    precision_scores = [metrics[n]['test']['precision'] for n in bar_names]
    recall_scores = [metrics[n]['test']['recall'] for n in bar_names]
    
    x = np.arange(len(bar_names))
    width = 0.25
    
    plt.bar(x - width, precision_scores, width, label='Precision')
    plt.bar(x, recall_scores, width, label='Recall')
    plt.bar(x + width, f1_scores, width, label='F1 Score')
    
    plt.xticks(x, [n.upper() for n in bar_names])
    plt.legend()
    plt.title('Classification Metrics Comparison (High/Low Usage)')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(VISUALIZATION_DIR, 'classification_metrics_comparison.png'))
    plt.close()

    # Final summary
    print("\n===== FINAL RESULTS SUMMARY =====")
    print(f"{'Model':<10} {'Test RMSE':<10} {'Test MAE':<10} {'Test R²':<10} {'F1':<8} {'Precision':<10} {'Recall':<10}")
    for n in bar_names:
        m = metrics[n]['test']
        print(f"{n.upper():<10} {m['rmse']:<10.4f} {m['mae']:<10.4f} {m['r2']:<10.4f} {m['f1']:<8.4f} {m['precision']:<10.4f} {m['recall']:<10.4f}")
    
    # Save ensemble predictions
    ensemble_results = pd.DataFrame({
        'Actual': y_test_orig.flatten(),
        'Predicted': test_preds.flatten(),
        'Error': y_test_orig.flatten() - test_preds.flatten()
    })
    ensemble_results.to_csv(os.path.join(MODEL_DIR, 'ensemble_predictions.csv'), index=False)
    
    print(f"All models trained and evaluated successfully. Results saved to {MODEL_DIR} and visualizations to {VISUALIZATION_DIR}")
    return metrics

if __name__ == "__main__":
    train_models()