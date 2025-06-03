import { useState } from "react";
import "./App.css";
import { URL } from "../src/constant";
import Answer from "../src/components/Answer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')));

  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {

    if (localStorage.getItem('history')) {
      let history = JSON.parse(localStorage.getItem('history'));
      history = [question,...history]
      localStorage.setItem('history',JSON.stringify(history));
      setRecentHistory(history)
    } else {
      localStorage.setItem('history',JSON.stringify([question]));
      setRecentHistory([question])
    }

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

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory('')
  }

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800">
        <h1 className="pt-5 text-white text-xl flex text-center justify-center">
          <span>Recent Search</span>
          <button onClick={clearHistory} className="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg></button>
          </h1>
        <ul className="overflow-auto text-left mx-5 p-7">
          {
            recentHistory && recentHistory.map((item) => (
              <li className="p-1 pl-5 truncate text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-300">{item}</li>
            ))
          }
        </ul>
      </div>
      <div className="col-span-4 p-10">
        <div className="container h-143 overflow-x-hidden">
          <div className="text-zinc-300">
            <ul>
              {result.map((item, index) => (
                <div
                  key={index + Math.random()}
                  className={item.type == "q" ? "flex justify-end" : ""}
                >
                  {item.type == "q" ? (
                    <li
                      className="text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl w-fit rounded-bl-3xl "
                      key={index + Math.random()}
                    >
                      <Answer
                        ans={item.text}
                        totalResult={1}
                        index={index}
                        type={item.type}
                      />
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
            placeholder="What's your mood today"
          />
          <button onClick={askQuestion} className="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/></svg></button>
        </div>
      </div>
    </div>
  );
}

export default App;
