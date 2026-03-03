"""Pydantic model for an AI tool listing."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ToolListing(BaseModel):
    """Structured representation of an AI tool from a directory."""

    name: str = Field(..., description="Tool name")
    description: str = Field(default="", description="Short or long description")
    url: Optional[str] = Field(default=None, description="Tool website URL")
    category: list[str] = Field(default_factory=list, description="Categories/tags")
    pricing: str = Field(default="unknown", description="free, freemium, paid, subscription, contact")
    features: list[str] = Field(default_factory=list, description="Feature list")
    logo_url: Optional[str] = Field(default=None, description="Logo image URL")
    rating: Optional[float] = Field(default=None, description="Numeric rating if available")
    review_count: Optional[int] = Field(default=None, description="Number of reviews if shown")
    source_site: str = Field(..., description="Source directory domain")
    scraped_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="ISO timestamp when scraped",
    )

    def to_csv_row(self) -> dict[str, str]:
        """Flatten for CSV export (lists as pipe-separated)."""
        return {
            "name": self.name,
            "description": self.description,
            "url": self.url or "",
            "category": "|".join(self.category),
            "pricing": self.pricing,
            "features": "|".join(self.features),
            "logo_url": self.logo_url or "",
            "rating": str(self.rating) if self.rating is not None else "",
            "review_count": str(self.review_count) if self.review_count is not None else "",
            "source_site": self.source_site,
            "scraped_at": self.scraped_at.isoformat(),
        }
