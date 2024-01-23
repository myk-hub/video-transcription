import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Grid, Typography, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import TranscriptionEditor from './components/TranscriptionEditor';
import ExportFormatSelect from './components/SelectExportFormat';
import SttTypeSelect from './components/SelectSstJsonType';
import transcriptDataJson from "./sample-data/transcriptData.json";
import { localSave, loadLocalSavedData, isVideoInLocalStorage } from "./localStorage";


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const App = () => {
  const transcriptEditorRef = useRef(null);
  const [videoConfig, setVideoConfig] = useState({
    transcriptData: null,
    mediaUrl: null,
    isTextEditable: true,
    spellCheck: false,
    sttType: "bbckaldi",
    analyticsEvents: [],
    title: "",
    fileName: "",
    autoSaveData: {},
    autoSaveContentType: "draftjs",
    autoSaveExtension: "json"
  });
 
  const videoUrl = "https://download.ted.com/talks/KateDarling_2018S-950k.mp4";
  const title = "TED Talk | Kate Darling - Why we have an emotional connection to robots";
 
  
  useEffect(() => {
    if(isVideoInLocalStorage(videoUrl)) {
      const transcriptDataFromLocalStorage = loadLocalSavedData(videoUrl)
      setVideoConfig({
        transcriptData: transcriptDataFromLocalStorage,
        mediaUrl: videoUrl,
        title,
        sttType: 'draftjs',
        ...videoConfig
      });
    } else {
      setVideoConfig({
        transcriptData: transcriptDataJson,
        mediaUrl: videoUrl,
        title,
        sttType: "bbckaldi",
      });
    }
  }, []);


  const loadDemo = () => {
    if (isVideoInLocalStorage(videoUrl)) {
      const transcriptDataFromLocalStorage = loadLocalSavedData(videoUrl)
      setVideoConfig({
        transcriptData: transcriptDataFromLocalStorage,
        mediaUrl: videoUrl,
        title,
        sttType: 'draftjs'
      });
    } else {
      setVideoConfig({
        transcriptData: transcriptDataJson,
        mediaUrl: videoUrl,
        title,
        sttType: "bbckaldi"
      });
    }
  };

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  const handleLoadMedia = files => {
    const file = files[0];
    const videoNode = document.createElement("video");
    const canPlay = videoNode.canPlayType(file.type);

    if (canPlay) {
      const fileURL = URL.createObjectURL(file);
      setVideoConfig({
        mediaUrl: fileURL,
        fileName: file.name
      });
    } else {
      alert("Select a valid audio or video file.");
    }
  };

  const handleLoadMediaUrl = () => {
    const fileURL = prompt("Paste the URL you'd like to use here:");

    setVideoConfig({
      // transcriptData: DEMO_TRANSCRIPT,
      mediaUrl: fileURL
    });
  };

  const handleLoadTranscriptJson = files => {
    const file = files[0];

    if (file.type === "application/json") {
      const fileReader = new FileReader();

      fileReader.onload = event => {
        setVideoConfig({
          transcriptData: JSON.parse(event.target.result)
        });
      };

      fileReader.readAsText(file);
    } else {
      alert("Select a valid JSON file.");
    }
  };

  const handleIsTextEditable = e => {
    setVideoConfig({
      ...videoConfig,
      isTextEditable: e.target.checked
    });
  };

  const handleSpellCheck = e => {
    setVideoConfig({
      spellCheck: e.target.checked
    });
  };

  // https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
  const handleSttTypeChange = event => {
    setVideoConfig({ [event.target.name]: event.target.value });
  };

  const handleExportFormatChange = event => {
    console.log(event.target.name, event.target.value);
    setVideoConfig({ [event.target.name]: event.target.value });
  };

  const exportTranscript = () => {
    console.log("export");
    // eslint-disable-next-line react/no-string-refs
    const { data, ext } = transcriptEditorRef.current.getEditorContent(
      videoConfig.exportFormat
    );
    let tmpData = data;
    if (ext === "json") {
      tmpData = JSON.stringify(data, null, 2);
    }
    if (ext !== "docx") {
      download(tmpData, `${videoConfig.mediaUrl}.${ext}`);
    }
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  const download = (content, filename, contentType) => {
    console.log("download");
    const type = contentType || "application/octet-stream";
    const link = document.createElement("a");
    const blob = new Blob([content], { type: type });

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // Firefox fix - cannot do link.click() if it's not attached to DOM in firefox
    // https://stackoverflow.com/questions/32225904/programmatical-click-on-a-tag-not-working-in-firefox
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    console.info("Cleared local storage.");
  };

  const handleAnalyticsEvents = event => {
    if (videoConfig.analyticsEvents)
      setVideoConfig({ ...videoConfig, analyticsEvents: [...videoConfig.analyticsEvents, event] });
  };

  const handleChangeTranscriptTitle = newTitle => {
    setVideoConfig({
      title: newTitle
    });
  };

  // const handleChangeTranscriptName = value => {
  //   setVideoConfig({ fileName: value });
  // };

  const handleAutoSaveChanges = newAutoSaveData => {
    console.log("handleAutoSaveChanges", newAutoSaveData);
    const { data, ext } = newAutoSaveData;
    setVideoConfig({ ...videoConfig, autoSaveData: data, autoSaveExtension: ext });
    // Saving to local storage 
    localSave(videoConfig.mediaUrl, videoConfig.fileName, data);
  };


  const headerControls = (
    <Grid container spacing={10}>
      <Grid item xs={2}>
        <Button variant="outlined" onClick={loadDemo}>
          Load Demo
        </Button>
      </Grid>

      <Grid item xs={2}>
        <InputLabel>Load Media{' '}</InputLabel>
        <Button variant="outlined" onClick={handleLoadMediaUrl}>From URL</Button>
        <br></br>
        <InputLabel htmlFor="mediaFile">Select From Computer</InputLabel>
        <Button
          type={"file"}
          id={"mediaFile"}
          onChange={(e) => handleLoadMedia(e.target.files)}
          component="label" variant="contained" startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
        {videoConfig.fileName !== "" ? (
          <InputLabel>
            {videoConfig.fileName}
          </InputLabel>
        ) : null}
      </Grid>

      <Grid item xs={2}>
        <InputLabel>Load Transcript{' '}</InputLabel>
        <SttTypeSelect
          name={"sttType"}
          value={videoConfig.sttType}
          handleChange={handleSttTypeChange}
        />
        <InputLabel htmlFor="transcriptFile">From Computer</InputLabel>
        <Button
          type={"file"}
          id={"transcriptFile"}
          onChange={e => handleLoadTranscriptJson(e.target.files)}
          component="label" variant="contained" startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </Grid>

      <Grid item xs={2}>
        <InputLabel>Export Transcript</InputLabel>
        <ExportFormatSelect
          name={"exportFormat"}
          value={videoConfig.exportFormat}
          handleChange={handleExportFormatChange}
        />
        <Button variant="outlined" onClick={exportTranscript}>Export File</Button>
      </Grid>

      <Grid item xs={2}>
        <div>
          <InputLabel htmlFor={"textIsEditableCheckbox"}>
            Text Is Editable
            <Checkbox
              id={"textIsEditableCheckbox"}
              type="checkbox"
              checked={videoConfig.isTextEditable}
              onChange={handleIsTextEditable}
            />
          </InputLabel>

        </div>

        <div>
          <InputLabel htmlFor={"spellCheckCheckbox"}>
            Spell Check <Checkbox id={"spellCheckCheckbox"} type="checkbox" onChange={handleSpellCheck} checked={videoConfig.spellCheck} />
          </InputLabel>
        </div>
        <Button variant="outlined" onClick={() => clearLocalStorage()}>
          Clear Local Storage
        </Button>
      </Grid>
    </Grid>
  )

  const analytics = (
    <>
      <section style={{ height: "250px", width: "50%", float: "left" }}>
        <h3>Components Analytics</h3>
        <textarea
          style={{ height: "100%", width: "100%" }}
          value={JSON.stringify(videoConfig.analyticsEvents, null, 2)}
          disabled
        />
      </section>

      <section style={{ height: "250px", width: "50%", float: "right" }}>
        <h3>
          Auto Save data:{" "}
          <code>
            {videoConfig.autoSaveContentType}| {videoConfig.autoSaveExtension}
          </code>
        </h3>
        <textarea
          style={{ height: "100%", width: "100%" }}
          value={
            videoConfig.autoSaveExtension === "json"
              ? JSON.stringify(videoConfig.autoSaveData, null, 2)
              : videoConfig.autoSaveData
          }
          disabled
        />
      </section>
    </>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>React Transcript Editor Demo</Typography>
      {headerControls}<br></br>
      <TranscriptionEditor
        transcriptData={videoConfig.transcriptData}
        fileName={videoConfig.fileName}
        mediaUrl={videoConfig.mediaUrl}
        isEditable={videoConfig.isTextEditable}
        spellCheck={videoConfig.spellCheck}
        sttJsonType={videoConfig.sttType}
        handleAnalyticsEvents={handleAnalyticsEvents}
        title={videoConfig.title}
        ref={transcriptEditorRef}
        handleAutoSaveChanges={handleAutoSaveChanges}
        autoSaveContentType={videoConfig.autoSaveContentType}
        mediaType='video'
      />
      {analytics}
    </Box>
  );
};

export default App;