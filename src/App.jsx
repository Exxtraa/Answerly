import { useState } from "react";
import "./App.css";
import { URL } from "../src/constant";
import Answer from "../src/components/Answer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);

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
    if (!question.trim()) return;

    setResult([
      ...result,
      { type: "q", text: question },
      { type: "a", text: dataString },
    ]);
    setQuestion("");
  };

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800"></div>
      <div className="col-span-4 p-10">
        <div className="container h-143 overflow-x-hidden">
          <div className="text-zinc-300">
            <ul>
              {result.map((item, index) => (
                <div key={index+Math.random()} className={item.type=='q'?'flex justify-end':''}>
                  {item.type == "q" ? (
                    <li
                      className="text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl w-fit rounded-bl-3xl "
                      key={index + Math.random()}
                    >
                      <Answer ans={item.text} totalResult={1} index={index} type={item.type}/>
                    </li>
                  ) : (
                    item.text.map((ansItem, ansIndex) => (
                      <li
                        key={ansIndex + Math.random()}
                        className="text-left p-1"
                      >
                        <Answer
                          ans={ansItem}
                          totalResult={item.length}
                          index={ansIndex}
                          type={item.type}
                        />
                      </li>
                    ))
                  )}
                </div>
              ))}
            </ul>
            {/* <ul>
              {
                result && result.map((item, index) => (
                  <li className="text-left p-1" key={index+Math.random()}><Answer ans={item} totalResult={result.length} index={index}/></li>
                ))
                } 
            </ul> */}
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
