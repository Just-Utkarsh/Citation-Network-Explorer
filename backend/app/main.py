from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.search import router as search_router

app = FastAPI(title="Citation Network Explorer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(search_router, prefix="/api")
