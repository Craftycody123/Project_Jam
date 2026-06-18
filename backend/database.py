# database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
import ssl, os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Fix driver prefix
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Strip params asyncpg doesn't understand — SSL handled via connect_args instead
parsed = urlparse(DATABASE_URL)
query_params = parse_qs(parsed.query)
query_params.pop("channel_binding", None)
query_params.pop("sslmode", None)
clean_query = urlencode({k: v[0] for k, v in query_params.items()})
DATABASE_URL = urlunparse(parsed._replace(query=clean_query))

# SSL context for Neon
ssl_context = ssl.create_default_context()

engine = create_async_engine(
    DATABASE_URL,
    echo=os.getenv("ENVIRONMENT") != "production",
    connect_args={"ssl": ssl_context},
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session