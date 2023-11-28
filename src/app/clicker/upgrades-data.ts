export const upgradesDefault: {
  name: string,
  cost: number,
  debuxPerSec?: number,
  debuxPerClick?: number,
  affordable: boolean,
  purchased: number,
  description: string
}[] = [
  {
    name: 'Multithreading', cost: 10, debuxPerSec: 1, affordable: false, purchased: 0,
    description: 'Increase processing power by utilizing multiple threads.'
  },
  {
    name: 'Optimization Algorithms', cost: 100, debuxPerSec: 10, affordable: false, purchased: 0,
    description: 'Enhance efficiency through advanced code optimization techniques.'
  },
  {
    name: 'Parallel Processing', cost: 1000, debuxPerSec: 100, affordable: false, purchased: 0,
    description: 'Enable simultaneous execution for faster processing.'
  },
  {
    name: 'Overclocking', cost: 10000, debuxPerSec: 1000, affordable: false, purchased: 0,
    description: 'Push the CPU to run faster, boosting processing power.'
  },
  {
    name: 'Hardware Upgrades', cost: 100000, debuxPerSec: 10000, affordable: false, purchased: 0,
    description: 'Install better processors or RAM to increase overall performance.'
  },
  {
    name: 'Cooling Systems', cost: 1000000, debuxPerSec: 100000, affordable: false, purchased: 0,
    description: 'Optimize cooling mechanisms to sustain higher processing speeds.'
  },
  {
    name: 'Syntax Highlighting', cost: 1, debuxPerClick: 1, affordable: false, purchased: 0,
    description: 'Boost click effectiveness with highlighted code segments.'
  },
  {
    name: 'Code Formatting', cost: 10, debuxPerClick: 10, affordable: false, purchased: 0,
    description: 'Improve the appearance of code to enhance click impact.'
  },
  {
    name: 'Auto-Completion', cost: 100, debuxPerClick: 100, affordable: false, purchased: 0,
    description: 'Increase code suggestion accuracy to amplify your clicks.'
  },
  {
    name: 'GUI Enhancements', cost: 1000, debuxPerClick: 1000, affordable: false, purchased: 0,
    description: 'Upgrade the interface for a more responsive and impactful clicking experience.'
  },
  {
    name: 'Mouse Acceleration', cost: 10000, debuxPerClick: 10000, affordable: false, purchased: 0,
    description: 'Improve click effectiveness by enhancing mouse sensitivity.'
  },
  {
    name: 'ChatGPT Evolution', cost: 1000, affordable: false, purchased: 0,
    description: 'Upgrade ChatGPT to a more advanced version, increasing its problem-solving capabilities and assistance in debugging.'
  },
  {
    name: 'Automated Testing', cost: 10000, affordable: false, purchased: 0,
    description: 'Develop a robust automated testing system that quickly identifies and reports bugs, making debugging more efficient.'
  },
  {
    name: 'Code Refactoring AI', cost: 100000, affordable: false, purchased: 0,
    description: 'Integrate AI-driven code refactoring to automatically improve code structure and readability during the debugging process.'
  },
  {
    name: 'Codebase Analysis', cost: 1000000, affordable: false, purchased: 0,
    description: 'Unlock in-depth analysis tools that provide insights into code quality, performance, and potential issues, aiding in targeted debugging efforts.'
  },
  {
    name: 'Tabnine', cost: 10000000, affordable: false, purchased: 0,
    description: 'Upgrade Tabnine\'s capabilities, allowing it to suggest code snippets and completions at an accelerated rate, improving coding speed and accuracy.'
  },
];
