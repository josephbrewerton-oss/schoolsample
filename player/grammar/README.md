# Open AST Grammars for Local LLMs (llama.cpp & Ollama)

These **GBNF (GGML BNF)** grammars enforce logit constraints on local Language Models (e.g. Llama 3, Phi-3, Mistral, Gemma 2, Qwen 2.5) during sampling.

## Why Use Grammar-Constrained Sampling?
1. **0% Hallucinated Syntax**: The model is mathematically forbidden from emitting malformed JSON, unclosed quotes, illegal easing identifiers, or timestamps out of bounds.
2. **Zero Prompt Engineering**: You do not need to beg the model with *"Output valid JSON only!"* or write complex retry loops.
3. **Low-Memory / Small Model Friendly**: Even 1B and 3B parameter models output 100% compliant AST scenes on the first token stream.

---

## 1. Using with `llama.cpp`

```bash
# Generate valid AST JSON scene
./llama-cli \
  -m ./models/qwen2.5-3b-instruct.gguf \
  --grammar-file ./static/player/grammar/ast-scene.gbnf \
  -p "Generate an educational vector animation showing lunar phases for KS2 Science." \
  -n 512
```

Or for token-efficient S-Expressions:
```bash
./llama-cli \
  -m ./models/phi-3-mini-4k-instruct.gguf \
  --grammar-file ./static/player/grammar/ast-sexpr.gbnf \
  -p "Generate an AST scene demonstrating photosynthesis reactants and products."
```

---

## 2. Using with Ollama API

You can pass the raw GBNF grammar directly to Ollama's `/api/generate` endpoint:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Create an AST vector scene explaining Pythagoras theorem.",
  "stream": false,
  "options": {
    "temperature": 0.2
  },
  "grammar": "'"$(cat static/player/grammar/ast-scene.gbnf)"'"
}'
```

---

## 3. Using in Python (`llama-cpp-python`)

```python
from llama_cpp import Llama, LlamaGrammar

llm = Llama(model_path="./models/mistral-7b-instruct-v0.3.Q4_K_M.gguf")

# Load the GBNF grammar
grammar = LlamaGrammar.from_file("static/player/grammar/ast-scene.gbnf")

response = llm(
    prompt="Generate an AST animation for water cycle evaporation and rain.",
    grammar=grammar,
    max_tokens=600,
    temperature=0.3
)

print(response["choices"][0]["text"])
# Output is guaranteed to be 100% valid AST JSON ready to feed into <micro-vector-player>!
```

---

## 4. Pipeline Integration with `<micro-vector-player>`

```javascript
// Example: Direct local streaming from on-device LLM to web component
async function generateAndPlayScene(promptText) {
  const response = await fetch('/api/local-llm-generate', {
    method: 'POST',
    body: JSON.stringify({ prompt: promptText, grammar: 'ast-scene.gbnf' })
  });
  const sceneJson = await response.json();

  // Dynamically feed into player
  const player = document.querySelector('micro-vector-player');
  player.parseAndSetScene(JSON.stringify(sceneJson));
}
```
