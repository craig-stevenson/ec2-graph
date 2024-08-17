import React, { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit'
import "xterm/css/xterm.css";
import { useLocation } from 'react-router';

export default function SocketIo(props) {
  const ssh = {
    username: props.username,
    host: props.host,
    port: props.port,
    keyName: props.keyName,
    sshKey: props.sshKey,
  };

  useEffect(() => {
    const fitAddon = new FitAddon();
    const term = new Terminal({cursorBlink: true, rows: 31});
    term.open(document.getElementById("terminal"));
    term.loadAddon(fitAddon);
    fitAddon.fit();
    term.writeln('Trying to connect ...');
    
    const socket = io('https://frozen-chamber-55810.herokuapp.com');
    
    socket.on("connect", () => {
      term.write('\r\n*** Connected to backend ***\r\n');
      socket.emit('ssh', ssh);
    });

    term.onKey(function (ev) {
      socket.emit('data', ev.key);
    });

    socket.on('data', function(data) {
      term.write(data);
    });

    socket.on('disconnect', function() {
      term.write('\r\n*** Disconnected from backend ***\r\n');
    });

    return ()=>{socket.disconnect()};
  }, []);

  const terminalContainer={
    width: '960px',
    padding: '2px',
    border: '1px solid black',
  }
  return (
    <div style={terminalContainer}>
      <div id="terminal" ></div>
    </div>
  )
}
