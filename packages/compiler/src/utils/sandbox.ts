export function createSandbox(data: Record<string, any>) {
  const dataInside = {
    ...data
  }

  // Browser implementation
  function createWorkerBlob(code: string) {
    const variableNames = Object.keys(dataInside).join(', ');
    const variableValues = Object.values(dataInside).map((v, index) => {
      if (typeof v === 'string') return `${variableNames[index]}:"${v}"`;
      if (typeof v === 'number') return `${variableNames[index]}:${v}`;
      if (typeof v === 'object' && v.type === 'expression') return `${variableNames[index]}:${v.value}`;
      if (typeof v === 'object') {
        try {
          return `${variableNames[index]}:${JSON.stringify(v)}`;
        } catch (e) {
          console.warn(`Failed to serialize ${variableNames[index]}`);
          return `${variableNames[index]}:null`;
        }
      }
      return `${variableNames[index]}:null`;
    }).join(', ');
    
    return window.URL.createObjectURL(
      new Blob([`
        self.onmessage = function() {
          try {
            const result = (function (${variableNames}) {
              return (${code});
            })({ ${variableValues} });
            self.postMessage(JSON.parse(JSON.stringify(result)));
          } catch (error) {
            self.postMessage({ error: error.message });
          }
        }
      `], {
        type: 'application/javascript'
      })
    )
  }

  // Node.js implementation
  function runInNode(fn: () => any) {
    return new Promise((resolve) => {
      const variableNames = [
        ...Object.keys(dataInside),
        ...Object.keys(window.EICH_ENV)
      ]
      console.log(variableNames)
      const variableValues = variableNames.map(name => {
        if (!Object.keys(dataInside).includes(name))
          return typeof window.EICH_ENV[name] !== 'object' ? `window.EICH_ENV.${name}` : `window.EICH_ENV.${name}.value`
        if (typeof dataInside[name] === 'string') return `"${dataInside[name]}"`;
        if (typeof dataInside[name] === 'number') return dataInside[name];
        if (typeof dataInside[name] === 'object' && dataInside[name].type === 'expression') return dataInside[name].value;
        return JSON.stringify(dataInside[name]);
      })

      console.log(variableValues)
      
      const code = `
        return (function(${variableNames.join(',')}) {
          return (${fn.toString()});
        })(${variableValues.join(',')})
      `;

      console.log(code)
      
      const result = (new Function(code))();
      
      resolve(result);
    });
  }

  function run(fn: () => any) {
    return runInNode(fn);
  }

  return {
    run
  }
}
