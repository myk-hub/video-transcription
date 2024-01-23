import React, { useEffect, useState } from 'react';

import TranscriptionEditor from './components/TranscriptionEditor';
import transcriptDataJson from "./sample-data/transcriptData.json";
import { loadLocalSavedData, isPresentInLocalStorage } from "./localStorage";


const App = () => {
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
    autoSaveExtension: "json",
  });
 
  const videoUrl = "https://download.ted.com/talks/KateDarling_2018S-950k.mp4";
  const title = "TED Talk | Kate Darling - Why we have an emotional connection to robots";
  
  useEffect(() => {
    if(isPresentInLocalStorage(videoUrl)) {
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

  return (
    <div>
      <TranscriptionEditor
        transcriptData={videoConfig.transcriptData}
        fileName={videoConfig.fileName}
        mediaUrl={videoConfig.mediaUrl}
        isEditable={videoConfig.isTextEditable}
        spellCheck={videoConfig.spellCheck}
        sttJsonType={videoConfig.sttType}
        handleAnalyticsEvents={videoConfig.handleAnalyticsEvents}
        title={videoConfig.title}
        ref={videoConfig.transcriptEditorRef}
        handleAutoSaveChanges={videoConfig.handleAutoSaveChanges}
        autoSaveContentType={videoConfig.autoSaveContentType}
        mediaType={ 'video' }
      />
      <section>
        <h3>Components Analytics</h3>
        <textarea
          style={{ height: "100%", width: "100%" }}
          value={JSON.stringify(videoConfig.analyticsEvents, null, 2)}
          disabled
        />
      </section>

      <section>
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
    </div>
  );
};

export default App;