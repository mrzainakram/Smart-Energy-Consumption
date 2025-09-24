from django.conf import settings
import os
import pandas as pd

def load_dataset(file_name=None):
    dataset_dir = os.path.join(settings.BASE_DIR, 'dataset')
    
    if file_name:
        # Load a single specific file
        dataset_path = os.path.join(dataset_dir, file_name)
        if os.path.exists(dataset_path):
            df = pd.read_csv(dataset_path)
            if 'Date_Time' in df.columns:
                df['Date_Time'] = pd.to_datetime(df['Date_Time'])
            print(f"Dataset {file_name} loaded successfully from {dataset_path}")
            return df
        else:
            print(f"Dataset file {file_name} not found at: {dataset_path}")
            return pd.DataFrame()
    else:
        # Load all files (original functionality)
        files = ['cleaned_house1.csv', 'cleaned_house2.csv', 'cleaned_house3.csv', 'cleaned_house4.csv', 'cleaned_house5.csv']
        all_dataframes = []
        for file in files:
            dataset_path = os.path.join(dataset_dir, file)
            if os.path.exists(dataset_path):
                df = pd.read_csv(dataset_path)
                if 'Date_Time' in df.columns:
                    df['Date_Time'] = pd.to_datetime(df['Date_Time'])
                all_dataframes.append(df)
                print(f"Dataset {file} loaded successfully from {dataset_path}")
            else:
                print(f"Dataset file {file} not found at: {dataset_path}")
        if all_dataframes:
            combined_df = pd.concat(all_dataframes, ignore_index=True)
            return combined_df
        return pd.DataFrame()

# Istemal ka tareeqa
data = load_dataset()