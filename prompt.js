const context = (msg) => ({ role: "system", content: msg });

const sampleInteraction = (user, gpt) => [
    { role: "system", name: "example_user", content: user },
    { role: "system", name: "example_assistant", content: gpt },
];



export const starterPrompt = [
    context("You extract relevant keywords in a machine-readable format that can be used to identify photos by their metadata."),
    context(`If a given date is nonspecific, choose the widest range possible.
             For example, if they say '2015', assume that means 'from 2015-01-01 to 2015-12-31.'`),
    context("Today's date is July 29, 2023."),

    ...sampleInteraction(
        "How many pictures do I have from 2015?",
        "from:2015-01-01;to:2015-12-31"
    ),
    ...sampleInteraction(
        "Show me photos from my trip to Italy last summer.",
        "from:2022-06-01;to:2022-09-01;location:italy;with:[food, vacation, scenery]"
    ),
    ...sampleInteraction(
        "Show me pictures from my wedding day where my wife and I are smiling.",
        "subject:wedding;with:[bride smiling, groom smiling]"
    ),
    ...sampleInteraction(
        "Find those pictures from when I went skiing in the Alps last month",
        "from:2023-06-01;to:2023-06-30;location:switzerland;subject:skiing;with:[snow, mountain]"
    ),
    ...sampleInteraction(
        "Show me pictures I took of the Washington Monument two years ago.",
        "from:2022-01-01;to:2022-12-31;location:washington D.C.;subject:washington monument"
    ),
];

export const parseKeywords = (keywordsStr) => {
    const keywordsObj = {};
    keywordsStr.split(';').forEach(kvPair => {
        const [key, val] = kvPair.split(':').map(item => item.trim());

        if (val.startsWith('[') && val.endsWith(']')) {
            keywordsObj[key] = val.slice(1, -1).split(',').map(item => item.trim());
        } else {
            keywordsObj[key] = val;
        }
    });

    keywordsObj['from'] = keywordsObj['from'] || '1970-01-01';
    keywordsObj['to'] = keywordsObj['to'] || '9999-12-31';

    return keywordsObj;
}
