import pytest
from unittest.mock import patch, MagicMock
from backend.ingestion.github_fetcher import GitHubFetcher

@pytest.mark.asyncio
async def test_github_fetcher_nonexistent_repo_asyncio():
    fetcher = GitHubFetcher()
    with patch("httpx.AsyncClient.get") as mock_get:
        mock_resp = MagicMock()
        mock_resp.status_code = 404
        mock_get.return_value = mock_resp
        with pytest.raises(ValueError, match="not found or inaccessible"):
            await fetcher.fetch_repository_info("nonexistent-org/nonexistent-repo-9999", strict=True)

@pytest.mark.trio
async def test_github_fetcher_nonexistent_repo_trio():
    fetcher = GitHubFetcher()
    with patch("httpx.Client.get") as mock_get:
        mock_resp = MagicMock()
        mock_resp.status_code = 404
        mock_get.return_value = mock_resp
        with pytest.raises(ValueError, match="not found or inaccessible"):
            fetcher.fetch_repository_sync("nonexistent-org/nonexistent-repo-9999", strict=True)
