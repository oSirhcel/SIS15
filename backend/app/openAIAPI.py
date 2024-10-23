from openai import OpenAI
import json
from config import Config
import httpx
import asyncio
import requests
client = OpenAI(api_key=Config.OPENAI_KEY)

"""
def open_ai_response(waste_classification):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": "Give me suggestions to recycle or reuse this waste: {}, also give me 2 companies/businesses in australia that could help in this process aswell as a link to their website or contact information return the answer in true json form e.g recycle_suggestion: xyz, reuse_suggestion: xyz, companies: [x,y]. all one line".format(waste_classification)
            }
        ]
    )
    cleaned_string = completion.choices[0].message.content.strip("`").replace("json", "")
    return json.loads(cleaned_string)


def format_companies(suggestions):
    #print(suggestions)
    for company in suggestions["companies"]:
        print(company)
"""

def get_address_from_coords(lat, lng):
    api_key = Config.GOOGLE_API_KEY
    url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'results' in data and len(data['results']) > 0:
            for component in data['results'][0]['address_components']:
                if 'locality' in component['types']:
                    suburb = component['long_name']
                if 'postal_code' in component['types']:
                    postcode = component['long_name']
            return suburb, postcode
        else:
            return None, None
    else:
        return None, None

# Example usage
latitude = -33.755740
longitude = 151.152380
suburb, postcode = get_address_from_coords(latitude, longitude)
print(suburb, postcode)

# Asynchronous function to call OpenAI API
async def call_openai(prompt):
    API_URL = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {Config.OPENAI_KEY}",
        "Content-Type": "application/json",
    }

    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 100,
        "temperature": 0.7
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, headers=headers, json=data)
        response.raise_for_status()
        return response.json()

# Asynchronous function to make multiple calls in parallel
async def main(waste_type, suburb, postcode):
    prompts = [
        "Give me suggestions to recycle or reuse this waste: {}".format(waste_type),
        "What colour bin does this type of waste: {} go in for this suburb and postcode in Australia: {}, {}".format(waste_type, suburb, postcode),
        "Give me 3 local business near suburb: {}, postcode: {} in Australia that can help me reuse or resycle this type of waste: {}".format(suburb, postcode, waste_type),
    ]

    # Use asyncio.gather to make multiple calls asynchronously
    responses = await asyncio.gather(*(call_openai(prompt) for prompt in prompts))
    print(responses)
    for i, response in enumerate(responses):
        print(f"Response {i + 1}: {response['choices'][0]['message']['content']}")

#def format_response(response_string):

# Run the main function
asyncio.run(main("Plastic", suburb, postcode))
