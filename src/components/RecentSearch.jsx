function RecentSearch({recentHistory,setRecentHistory,setSelectedHistory}) {

     const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  return (
    <>
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
          {
          recentHistory && recentHistory.map((item , index) => (
              <li key={index} onClick={() => setSelectedHistory(item)}className="p-2 pl-5 truncate rounded-3xl text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-300">{item}</li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default RecentSearch;