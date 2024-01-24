import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const ExportFormatSelect = props => (
  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
    <Select type="compact" label="Select transcript" className={props.className} name={props.name} value={props.value} onChange={props.handleChange}>
        <MenuItem value="draftjs">Draft Js</MenuItem>
        <MenuItem value="txt">Text file</MenuItem>
        <MenuItem value="txtspeakertimecodes">Text file - with Speakers and Timecodes</MenuItem>
        <MenuItem value="html" disabled>HTML</MenuItem>
        <MenuItem value="word" disabled>MS Word</MenuItem>
        <MenuItem value="digitalpaperedit">Digital Paper Edit</MenuItem>
        <MenuItem value="srt">Srt - Captions</MenuItem>
        <MenuItem value="ttml">TTML - Captions</MenuItem>
        <MenuItem value="premiereTTML">TTML for Adobe Premiere - Captions</MenuItem>
        <MenuItem value="itt">iTT - Captions</MenuItem>
        <MenuItem value="csv">CSV - Captions</MenuItem>
        <MenuItem value="vtt">VTT - Captions</MenuItem>
        <MenuItem value="pre-segment-txt">Pre-segment-txt - Captions</MenuItem>
        <MenuItem value="docx">MS Word</MenuItem>
        <MenuItem value="json-captions">Json - Captions</MenuItem>
      </Select>
  </FormControl>
);

export default ExportFormatSelect;
