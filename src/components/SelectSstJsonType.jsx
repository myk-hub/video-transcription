import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';


const SttTypeSelect = props => (
  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
    <Select className={props.className} name={props.name} value={props.value} onChange={props.handleChange}>
      <MenuItem value="bbckaldi">BBC Kaldi</MenuItem>
      <MenuItem value="draftjs">Draft Js</MenuItem>
      <MenuItem value="gentle-transcript" disabled>Gentle Transcript</MenuItem>
      <MenuItem value="gentle-alignement" disabled>Gentle Alignement</MenuItem>
      <MenuItem value="iiif" disabled>IIIF</MenuItem>
      <MenuItem value="autoedit2">autoEdit 2</MenuItem>
      <MenuItem value="speechmatics">Speechmatics</MenuItem>
      <MenuItem value="ibm">IBM Watson STT</MenuItem>
      <MenuItem value="assemblyai" disabled>AssemblyAI</MenuItem>
      <MenuItem value="rev" disabled>Rev</MenuItem>
      <MenuItem value="srt" disabled>Srt</MenuItem>
      <MenuItem value="vtt" disabled>VTT</MenuItem>
      <MenuItem value="vtt-youtube" disabled>Youtube VTT</MenuItem>
      <MenuItem value="amazontranscribe">Amazon Transcribe</MenuItem>
      <MenuItem value="digitalpaperedit">Digital Paper Edit</MenuItem>
      <MenuItem value="google-stt">Google STT</MenuItem>
    </Select>
  </FormControl>
);

export default SttTypeSelect;