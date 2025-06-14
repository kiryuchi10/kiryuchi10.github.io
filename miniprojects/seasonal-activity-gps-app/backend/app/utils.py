from datetime import datetime

def current_season(lat: float, dt: datetime):
    hemi = "north" if lat >= 0 else "south"
    season_idx = (dt.month % 12) // 3  # meteorological
    return ["winter", "spring", "summer", "autumn"][season_idx] + "_" + hemi
