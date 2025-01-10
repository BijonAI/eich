export function createSandbox(data: Record<string, any>) {
  const dataInside = {
    ...data
  }

  // Browser implementation
  function createWorkerBlob(code: string) {
    const variableNames = Object.keys(dataInside).join(', ');
    const variableValues = Object.values(dataInside).map(v => {
      if (typeof v === 'string') return `"${v}"`;
      if (typeof v === 'number') return v;
      if (typeof v === 'object' && v.type === 'expression') return v.value;
      return JSON.stringify(v);
    }).join(', ');
    console.log(variableNames, variableValues)

    return window.URL.createObjectURL(
      new Blob([
        `(function ({ ${variableNames} }) {
          return (${code})();
        })({ ${variableValues} })`
      ], {
        type: 'application/javascript'
      })
    )
  }

  // Node.js implementation
  function runInNode(fn: () => any) {
    return new Promise((resolve) => {
      const variableNames = Object.keys(dataInside);
      const variableValues = Object.values(dataInside).map(v => {
        if (typeof v === 'string') return `"${v}"`;
        if (typeof v === 'number') return v;
        if (typeof v === 'object' && v.type === 'expression') return v.value;
        return JSON.stringify(v);
      });
      // console.log(variableNames, variableValues)
      
      const code = `
        return (function(${variableNames.join(',')}) {
          return (${fn.toString()});
        })(${variableValues.join(',')})
      `;
      
      const result = (new Function(code))();
      resolve(result);
    });
  }

  function run(fn: () => any) {
    if (typeof window !== 'undefined') {
      return new Promise((resolve) => {
        const blob = createWorkerBlob(fn.toString())
        const worker = new Worker(blob)
        worker.onmessage = (e) => {
          worker.terminate()
          resolve(e.data)
        }
        worker.postMessage(dataInside)
      })
    } else {
      return runInNode(fn);
    }
  }

  return {
    run
  }
}
