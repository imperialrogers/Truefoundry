import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { BiSend, BiSolidUserCircle } from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import "./index.css";
import { BiUser } from "react-icons/bi";

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const scrollToLastItem = useRef(null);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo"); 
  const [temperature, setTemperature] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(100);
  const [topP, setTopP] = useState(1.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const handleRedirect = () => {
    window.location.href = "/admin/dashboard";
  };
 
  const submitHandler = async (e) => {
    e.preventDefault(); 
    if (!text) return;

    setIsResponseLoading(true);
    setErrorText("");

    const userMessage = {
      role: "user",
      content: text,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    scrollToLastItem.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
        metadata: {
          user: "Web Client",
          env: "production",
          model: selectedModel,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty,
        },
      }),
    };

    try {
      const response = await fetch(`https://truefoundry-0-0-0-release.onrender.com/openai`, options);

      if (response.status === 429) {
        setErrorText("Too many requests, please try again later.");
        return;
      }

      const data = await response.json();

      if (data.error) {
        setErrorText(data.error.message);
      } else {
        const responseData = data.choices[0].message;
        setMessages((prevMessages) => [...prevMessages, responseData]);
        setText("");
        scrollToLastItem.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }
    } catch (e) {
      setErrorText(e.message);
      console.error(e);
    } finally {
      setIsResponseLoading(false);
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsShowSidebar(window.innerWidth <= 640);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="container">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
          <div className="sidebar-header">
            <BiUser size={20} />
            <button onClick={handleRedirect}>GO TO DASHBOARD</button>
          </div>
          <div className="model-select">
            <label htmlFor="model-select">Select Model:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</option>
              <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
              <option value="gpt-3.5-turbo-0301">gpt-3.5-turbo-0301</option>
              <option value="gpt-3.5-turbo-0125">gpt-3.5-turbo-0125</option>
              <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
              <option value="gpt-3.5-turbo-16k-0613">
                gpt-3.5-turbo-16k-0613
              </option>
            </select>
          </div>
          <div className="model-select-filters">
            <div className="filter-item">
              <label htmlFor="temperature">Temperature:</label>
            </div>
            <div className="filter-item">
              <input
                type="number"
                id="temperature"
                placeholder="0.00 - 1.00"
                min="0"
                max="1"
                step="0.01"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>
            <div className="filter-item">
              <label htmlFor="maxTokens">Max Tokens:</label>
            </div>
            <div className="filter-item">
              <input
                type="number"
                id="maxTokens"
                placeholder="1 - 4096"
                min="1"
                max="4096"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              />
            </div>
            <div className="filter-item">
              <label htmlFor="topP">Top P:</label>
            </div>
            <div className="filter-item">
              <input
                type="number"
                id="topP"
                placeholder="0.00 - 1.00"
                min="0"
                max="1"
                step="0.01"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
              />
            </div>
            <div className="filter-item">
              <label htmlFor="frequencyPenalty">Frequency Penalty:</label>
            </div>
            <div className="filter-item">
              <input
                type="number"
                id="frequencyPenalty"
                placeholder="0.00 - 1.00"
                min="0"
                max="1"
                step="0.01"
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
              />
            </div>
            <div className="filter-item">
              <label htmlFor="presencePenalty">Presence Penalty:</label>
            </div>
            <div className="filter-item">
              <input
                type="number"
                id="presencePenalty"
                placeholder="0.00 - 1.00"
                min="0"
                max="1"
                step="0.01"
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </section>

        <section className="main">
          {isShowSidebar ? (
            <MdOutlineArrowRight
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          ) : (
            <MdOutlineArrowLeft
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          )}
          <div className="main-header">
            <ul>
              {messages.map((message, index) => (
                <li key={index} ref={scrollToLastItem}>
                  {message.role === "user" ? (
                    <BiSolidUserCircle size={28.8} />
                  ) : (
                    <BiSolidUserCircle size={28.8} />
                  )}
                  <div>
                    <p className="role-title">{message.role === "user" ? "You" : "ChatGPT"}</p>
                    <p>{message.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="main-bottom">
            {errorText && <p className="errorText">{errorText}</p>}
            <form className="form-container" onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Send a message."
                spellCheck="false"
                value={isResponseLoading ? "Processing..." : text}
                onChange={(e) => setText(e.target.value)}
                readOnly={isResponseLoading}
              />
              {!isResponseLoading && (
                <button type="submit">
                  <BiSend size={20} />
                </button>
              )}
            </form>
            <p>
              ChatGPT can make mistakes. Consider checking important information.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
