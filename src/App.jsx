import { useState } from "react";
import "./App.css";
import { URL } from "../src/constant";
import Answer from "../src/components/Answer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(undefined);

  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());
    console.log(dataString);
    if(!question.trim()) return;

    setResult(dataString);
    setQuestion("");
  };

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800"></div>
      <div className="col-span-4 p-10">
        <div className="container h-143 overflow-x-hidden">
          <div className="text-zinc-300">
            <ul>
              {/* {result} */}
              {
                result && result.map((item, index) => (
                  <li className="text-left p-1" key={index}><Answer ans={item} totalResult={result.length} index={index}/></li>
                ))
                } 
            </ul>
          </div>
        </div>
        <div className="bg-zinc-800 w-1/2 pr-9 text-white m-auto rounded-4xl border border-zinc-500 flex h-16">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-full p-8 outline-none"
            placeholder="Ask me anything"
          />
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  );
}

export default App;
