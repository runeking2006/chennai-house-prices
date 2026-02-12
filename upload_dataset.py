from huggingface_hub import upload_file

upload_file(
    path_or_fileobj="modified_dataset.csv",
    path_in_repo="modified_dataset.csv",
    repo_id="runeking2006/ROUGH_TAMIL_NADU_HOUSING_DATASET",
    repo_type="dataset"
)