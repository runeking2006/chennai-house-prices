from huggingface_hub import upload_folder

upload_folder(
    folder_path="D:\\chennai-house-prices\\backend\\models",
    repo_id="runeking2006/tamilnadu-house-prices",
    repo_type="model"
)
