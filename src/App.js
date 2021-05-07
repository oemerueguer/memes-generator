import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Spinner } from "reactstrap";
import "./App.css";
import React from "react";
import domtoimage from 'dom-to-image';

function App() {
  const [data, setData] = useState([]);
  const [topMeme, setTopMeme] = useState("");
  const [bottomMeme, setBottomMeme] = useState("");
  const [randomMeme, setRandomMeme] = useState(0);
  const [url, setURL] = useState("https://i.imgflip.com/345v97.jpg");
  const [genUrl, setGenUrl] = useState("");
  const [spinner, setSpinner] = useState(false);
  const refContainer = useRef(null);

  useEffect(() => {
    const getMemes = async () => {
      try {
        const result = await axios.get(`https://api.imgflip.com/get_memes`);
        setData(result.data.data.memes);
        setSpinner(false);
        /* throw new Error("oopsie..."); */
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };

    setSpinner(true);
    getMemes();
  }, []);

  const getRandomMeme = () => {
    setRandomMeme(Math.floor(Math.random() * 100));
    setURL(data[randomMeme].url);
  };

  const handleTopTextChange = (e) => {
    setTopMeme(e.target.value);
  };

  const handleBottomTextChange = (e) => {
    setBottomMeme(e.target.value);
  };

  const handleUrlChange = (e) => {
    let newURL = URL.createObjectURL(e.target.files[0]);
    setURL(newURL);
  };

  const handleResetButton = () => {
    setTopMeme("");
    setBottomMeme("");
  };

  const handleGenerate = () => {
    let node = document.getElementById("meme");
    domtoimage.toPng(node)
    .then(function (dataUrl) {
        let img = new Image();
        img.src = dataUrl;
        console.log(img);
        refContainer.current = img;
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
  }

  return (
    <div className="App">
      {spinner ? (
        <Spinner style={{ width: "3rem", height: "3rem" }} />
      ) : (
        <div>
          <h1>Get your Memes</h1>
          <form>
            <input
              value={topMeme}
              placeholder="Add text to top"
              name="toptext"
              type="text"
              className="LeftInput"
              onChange={handleTopTextChange}
            />
            <input
              value={bottomMeme}
              placeholder="Add text to bottom"
              name="bottomText"
              type="text"
              className="RightInput"
              onChange={handleBottomTextChange}
            />
          </form>
          <div className="flexbox">
            <button onClick={getRandomMeme}>Change picture</button>
            <input
              className="uploadButton"
              type="file"
              id="myfile"
              name="myfile"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={handleUrlChange}
            ></input>
            <button type="file" id="myfile" name="myfile">
              Load Image
            </button>
            <button onClick={handleGenerate}>Generate</button>
            <button className="resetButton" onClick={handleResetButton}>Reset</button>
          </div>
          <div id="meme" className="meme">
            <img src={url} alt="" />
            <h2 className="top">{topMeme}</h2>
            <h2 className="bottom">{bottomMeme}</h2>
          </div>
          <div>h{refContainer.current}</div>
        </div>
      )}
    </div>
  );
}

export default App;
