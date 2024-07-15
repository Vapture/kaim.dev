import { useState, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import { Chess } from 'chess.js';

const initialFileSystem = {
  '/': {
    type: 'folder',
    children: {
      education: {
        type: 'folder',
        children: {
          certificates: {
            type: 'folder',
            children: {
              '98-375.txt': { type: 'file', content: `The Microsoft MTA 98-375 exam, titled "HTML5 Application Development Fundamentals," assesses foundational knowledge in HTML5, CSS3, and JavaScript. It focuses on developing Windows Store apps and includes topics such as managing the application life cycle, building the user interface by using HTML5, formatting the user interface by using CSS, and coding by using JavaScript.` },
              '98-364.txt': { type: 'file', content: `The Microsoft MTA 98-364 exam, titled "Database Fundamentals," assesses foundational knowledge in database concepts and SQL. The exam covers core database concepts, the creation of database objects, data storage, administering a database, and data manipulation. It is designed for individuals seeking to demonstrate basic skills and knowledge in database management.` },
            },
          },
          education: {
            type: 'folder',
            children: {
              'wsei.txt': { type: 'file', content: `Bachelor of Engineering in Mobile and Web Application Programming within Computer Science and Econometrics, acquired at Wyższa Szkoła Ekonomii i Informatyki`},
              'zsl.txt': { type: 'file', content: 'IT Technician acquired in Upper-Secondary Schools of Communications - Zespół Szkół Łączności w Krakowie, Technikum Łączności nr 14' },
            },
          },
        },
      },
      experience: {
        type: 'folder',
        children: {
          'vapture.txt': { type: 'file', content: `As web developer driven by curiosity, I operate a business, conduct client communication and manage complex website projects (i.a. Robinson Travel, Tysiola) using hand-coded solutions (using React) along with Node.js and the .NET ecosystem, mainly ASP.NET (MVC), likewise CRMs (WordPress). As a freelancer, I translated multiple medical device manuals (TransPerfect).` },
          'archman.txt': { type: 'file', content: `I uncovered high-risk vulnerabilities in proprietary ECM platform through black box penetration testing (Wireshark, AppSpider and Chrome Dev Tools), then documented findings in the accessible document with mitigation strategies and delivered them to development team. Presented findings reduced attack risk and clearly strengthened platform security.` },
          'wsei.txt': { type: 'file', content: `As developer and graphic designer at WSEI, I co-organized 3 successful hackathons attracting 100+ participants using Microsoft tools within Azure. Streamlined team communication with hand-coded email newsletters. I created engaging graphics (infographics, social media posts) contributing to bragnd awareness. I led WSEIcraft 4.0 team as Student Government VP.` },
          'saltmine.txt': { type: 'file', content: `I migrated data seamlessly between numerous Oracle Database sites, ensuring smooth transitions and data integrity, created a comprehensive local network map using Microsoft Visio, aiding in efficient network troubleshooting and maintenance. I demonstrated initiative by taking on physical maintenance of equipment, ensuring continued uptime and operation, also proactively shared knowledge, fostering team efficiency.` },
        },
      },
      contact: {
        type: 'folder',
        children: {
          'info.txt': { type: 'file', content: 'I currently reside in Krakow, Poland. You may contact me with phone (+48 666 550 888) and by e-mail (hello@kaim.dev or krzysztof@kaim.net).' },
          'mail.sh': { type: 'file', content: 'mailto:hello@kaim.dev' },
        },
      },
      tools: {
        type: 'folder',
        children: {
          'toolsused.txt': { type: 'file', content: '@14islands/r3f-scroll-rig, @react-three/drei, @react-three/fiber, @react-three/postprocessing, @react-three/rapier, @studio-freight/lenis, @whatisjery/react-fluid-distortion, eslint, eslint-config-next, framer-motion, gsap, lenis, leva, locomotive-scroll, maath, matter-js, next, p5, postprocessing, react, react-dom, react-intersection-observer, sass, sharp, three. Music is Roalty Free from Pixabay. Video crafted in DaVinci Resolve. Mailing handled by Brevo.' },
          'credits.txt': { type: 'file', content: 'Inspired by Lusion.co and several other webpages. Grid is Based on Bento-style.' },
        },
      },
    },
  },
};

const Terminal = () => {
  const [output, setOutput] = useState([
    {
      text: (
        <>
          Welcome to K
          <span style={{ color: "#8d86fc" }}>
            AI
          </span>
          M-Terminal!
        </>
      ),
    },
    { text: (
      <>
        Type
        <span style={{ color: "#8d86fc" }}>
        &nbsp;&#39;help&#39;
        </span>
        &nbsp;for a list of all available commands
      </>
    ), }
  ]);

  const [currentDir, setCurrentDir] = useState('/');
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fileSystem] = useState(initialFileSystem);
  const [mooCount, setMooCount] = useState(0);
  const terminalRef = useRef(null);
  const chess = useRef(null);

  useEffect(() => {
    chess.current = new Chess();
  }, []);

  const commands = {
    ls: () => {
      const dir = getDir(currentDir);
      if (dir && dir.children) {
        return Object.keys(dir.children).join(' ');
      }
      throw new Error('Directory not found');
    },
    cd: (dir) => {
      if (!dir || dir === '/') {
        setCurrentDir('/');
        return '';
      }
      const targetDir = dir.startsWith('/') ? dir : `${currentDir}${dir}/`;
      const dirObject = getDir(targetDir);
      if (dirObject) {
        if (dirObject.type === 'folder') {
          setCurrentDir(targetDir);
          return '';
        } else {
          return `cd: ${dir}: Not a directory`;
        }
      } else {
        return `cd: no such file or directory: ${dir}`;
      }
    },
    pwd: () => currentDir,
    cat: (fileName) => {
      const dir = getDir(currentDir);
      if (dir.children[fileName]) {
        if (dir.children[fileName].type === 'file') {
          return dir.children[fileName].content;
        } else {
          return `cat: ${fileName}: Is a directory`;
        }
      } else {
        return `cat: ${fileName}: No such file or directory`;
      }
    },
    echo: (...args) => args.join(' '),
    clear: () => {
      setOutput([]);
      return '';
    },
    help: () => {
      return `Available commands: ${Object.keys(commands).join(', ')}`;
    },
    whoami: () => `${window.navigator.userAgent}`,
    vi: () => {
      return "Why use vi? Try 'emacs'";
    },
    vim: () => {
      return "Why use vim? Try 'emacs'";
    },
    emacs: () => {
      return "Why use emacs? Try 'vim'";
    },
    moo: () => {
      const responses = [
        "There are no Easter Eggs in this program.",
        "There really are no Easter Eggs in this program.",
        "Didn't I already tell you that there are no Easter Eggs in this program?",
        `All right, you win. --------{---(@`,
        "What is it? It's a Rose, of course."
      ];
      setMooCount(mooCount + 1);
      return responses[mooCount % responses.length];
    },
    chess: () => {
      setOutput((prev) => [...prev, { text: (
        <>
          Started game of chess. Type
          <span style={{ color: "#b8b3fc" }}>
          &nbsp;&#39;board&#39;
          </span>
          &nbsp;to view board
        </>
      )
    }]);
      chess.current.reset();
      return 'You are playing as white. Type "move <move>" to make a move, e.g. "move e4".';
    },
    move: (move) => {
      try {
        chess.current.move(move);
        setOutput((prev) => [...prev, { text: `You moved ${move}.` }]);
    
        const moves = chess.current.moves();
        const aiMove = moves[Math.floor(Math.random() * moves.length)];
        chess.current.move(aiMove);
        setOutput((prev) => [...prev, { text: `AI moved ${aiMove}.` }]);
    
        const board = chess.current.board();
        const boardView = board.map((row, i) => {
          return (
            <div key={i} className={styles.row}>
              {row.map((square, j) => {
                const piece = square? square.type + square.color : '';
                return (
                  <div key={j} className={styles.square}>
                    <div className={styles.piece}>{piece}</div>
                  </div>
                );
              })}
            </div>
          );
        });
        setOutput((prev) => [...prev, { text: boardView }]);
    
        if (chess.current.isGameOver()) {
          setOutput((prev) => [...prev, { text: 'Game over!' }]);
        }
    
        return '';
      } catch (error) {
        return `Error: ${error.message}`;
      }
    },
    board: () => {
      const board = chess.current.board();
      const boardView = board.map((row, i) => {
        return (
          <div key={i} className={styles.row}>
            {row.map((square, j) => {
              const piece = square ? square.type + square.color : '';
              return (
                <div key={j} className={styles.square}>
                  <div className={styles.piece}>{piece}</div>
                </div>
              );
            })}
          </div>
        );
      });
      setOutput((prev) => [...prev, { text: boardView }]);
      return '';
    },
  }

  const getDir = (path) => {
    try {
      const parts = path.split('/').filter(Boolean);
      let dir = fileSystem['/'];
      for (const part of parts) {
        if (dir.children[part]) {
          dir = dir.children[part];
        } else {
          return null;
        }
      }
      return dir;
    } catch (error) {
      throw new Error('Error navigating the file system');
    }
  }

  const handleCommand = (command) => {
    if (command.length > 500) {
      setOutput((prev) => [
        ...prev,
        { text: 'Error: Command length exceeds the allowed limit of 500 characters. You did not want to inject some code to test the security of the site, did you? ', animate: true },
      ]);
      return;
    }

    const [cmd, ...args] = command.split(' ');
    const prompt = `visitor@kaim.dev:${currentDir}$ ~ `;

    if (cmd === 'mail.sh' && currentDir === '/contact/') {
      window.location.href = 'mailto:hello@kaim.dev';
      return;
    }

    if (cmd === 'su') {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      return;
    }

    if (cmd === 'sudo') {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      return;
    }

    if (cmd === 'kurwa') {
      window.open('https://www.youtube.com/watch?v=4S5I6X6su2o', '_blank');
      return;
    }

    if (cmd === 'dupa') {
      window.open('https://www.youtube.com/watch?v=yCjGOhIIgQQ', '_blank');
    }

    if (cmd === 'chuj') {
      window.open('https://www.youtube.com/watch?v=8mPT-kic3r8', '_blank');
    }

    if (cmd === 'lol') {
      window.open('https://www.youtube.com/watch?v=8mPT-kic3r8', '_blank');
    }

    try {
      if (commands[cmd]) {
        const result = commands[cmd](...args);
        if (cmd === 'clear') {
          setOutput([]);
        } else if (result !== undefined) {
          setOutput((prev) => [
            ...prev,
            { prompt, command },
            { text: result, animate: true },
          ]);
        }
      } else {
        setOutput((prev) => [
          ...prev,
          { prompt, command },
          { text: `${cmd}: command not found`, animate: true },
        ]);
      }
    } catch (error) {
      setOutput((prev) => [
        ...prev,
        { prompt, command },
        { text: `Error: ${error.message}`, animate: true },
      ]);
    }

    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [output]);

  return (
    <div className={styles.terminal} ref={terminalRef} onClick={() => document.getElementById('terminalInput').focus()}>
      <div className={styles.output}>
      {output.map((line, index) => (
        <div key={index} className={line.animate ? styles.newLine : ''}>
          {line.prompt ? (
            <span className={styles.command}>{line.command}</span>
          ) : typeof line.text === 'string' ? (
            line.text
          ) : (
            <span className={line.style}>{line.text}</span>
          )}
        </div>
      ))}
      <div className={styles.inputLine}>
        <span>
          <span className={styles.visitor}>visitor</span>
          <span>@</span>
          <span className={styles.kaimme}>kaim.dev</span>
          :{currentDir}$ ~&nbsp;
        </span>
        <input
          id="terminalInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInput}
          autoFocus
          className={`${styles.input} ${styles.command}`}
        />
      </div>
    </div>
    </div>
  );
};

export default Terminal;