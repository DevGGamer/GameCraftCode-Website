from fastapi import APIRouter, Depends, File, UploadFile
from typing import List
from minio.error import S3Error
import io

from ..auth import verify_token
from ..dependencies import minio_client

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload/{bucket}")
async def upload_files(
    bucket: str,
    files: List[UploadFile] = File(...),
    _auth: dict = Depends(verify_token)
):
    found = minio_client.bucket_exists(bucket)
    if not found:
        minio_client.make_bucket(bucket)

    uploaded_files = []
    for file in files:
        try:
            content = await file.read()
            file_stream = io.BytesIO(content)
            minio_client.put_object(
                bucket,
                file.filename,
                data=file_stream,
                length=len(content),
                content_type=file.content_type
            )
            uploaded_files.append(file.filename)
        except S3Error as err:
            return {"error": str(err)}

    return {"uploaded": uploaded_files}
