CLASS_MAPPING = {
    "trash": "General Waste",
    "brown-glass": "Glass",
    "green-glass": "Glass",
    "white-glass": "Glass",
    "biological": "Organic Waste",
    "metal": "Scrap Metal"
}

def map_class(classification):
    for k, v in CLASS_MAPPING.items():
        if classification == k:
            return v
        
    return classification.capitalize()