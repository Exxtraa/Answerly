import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "../src/constant";
import Answer from "../src/components/Answer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);

  const askQuestion = async () => {
    if (!question && !selectedHistory) {
      return false;
    }

    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setRecentHistory([question]);
      }
    }

    const payloadData = question ? question : selectedHistory;
    const payload = {
      contents: [
        {
          parts: [{ text: payloadData }],
        },
      ],
    };

    setLoader(true);

    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());
    console.log(dataString);

    setResult([
      ...result,
      { type: "q", text: question ? question : selectedHistory },
      { type: "a", text: dataString },
    ]);
    setQuestion("");

    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);

    setLoader(false);
  };

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory("");
  };

  const isEnter = () => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    askQuestion();
  }, [selectedHistory]);

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-800">
        <h1 className="pt-5 text-white text-xl flex text-center justify-center">
          <span>Recent Search</span>
          <button onClick={clearHistory} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
            </svg>
          </button>
        </h1>
        <ul className="overflow-auto text-left mx-2 p-2">
          {recentHistory &&
            recentHistory.map((item) => (
              <li
                onClick={() => setSelectedHistory(item)}
                className="p-1z pl-5 truncate text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-300"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-span-4 p-10">
        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700"
        >Hello User,Ask me Anything</h1>
        {loader ? (
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        ) : null}

        <div ref={scrollToAns} className="container h-143 overflow-x-hidden">
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
            onKeyDown={isEnter}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-full p-8 outline-none"
            placeholder="What's your mood today"
          />
          <button onClick={askQuestion} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
