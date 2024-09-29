from openai import OpenAI
import json
client = OpenAI(api_key="dummy key")


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

#format_companies(open_ai_response("general waste"))