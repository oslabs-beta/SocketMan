# Right now, we expect to have 3 codebases to consider:

Our server

- serves the GUI
- NEVER receives their data

Their server, their client, etc

- only for testing purposes!

Our npm package

- holds code that integrates with their server (like a middleman?)

====================================================

# Questions

- do we need to somehow ask the dev's server what version it's using?

# Sending payload that may or may not include CB...

- Option A: make user put everything in one JSON
- Problems:
  -- Less intuitive
  -- Functions are not valid JSON values

- Option B: provide 2 inputs for payload: anything normal, then option callback string
- Problems:
  -- Functions are still not valid JSON values
  -- Meaning we need to convert to a function before sending it in the emit

This meanse we need more fields or a way to parse the function
We'll have to build it using the `new Function` constructor. This takes any amount of params, with the last one being the "body" of the function

Meaning Option B should be:
1 input for all regular payload args
1 form for building the function

- 1 input for all params to func
- 1 input for the "body" of the function
