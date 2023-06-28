// Step 1: Reading samples.json using D3
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
  // Step 2: Creating the horizontal bar chart
  function createBarChart(sample) {
    let sampleData = data.samples.find(d => d.id === sample);
    let top10OTUs = sampleData.otu_ids.slice(0, 10).map(d => `OTU ${d}`).reverse();
    let top10Values = sampleData.sample_values.slice(0, 10).reverse();
    let top10Labels = sampleData.otu_labels.slice(0, 10).reverse();

    let trace = {
      x: top10Values,
      y: top10OTUs,
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };

    let layout = {
      title: `Top 10 OTUs for Sample ${sample}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", [trace], layout);
  }

  // Step 3: Creating the bubble chart
  function createBubbleChart(sample) {
    let sampleData = data.samples.find(d => d.id === sample);
  
    let scalingFactor = 0.5; // Adjust the scaling factor as desired
  
    let trace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values.map(value => value * scalingFactor), // Adjust the size scaling here
        color: sampleData.otu_ids,
        colorscale: "Earth"
      }
    };
  
    let layout = {
      title: `OTU IDs and Sample Values for Sample ${sample}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };
  
    Plotly.newPlot("bubble", [trace], layout);
  }

  // Step 4: Display sample metadata
  function displayMetadata(sample) {
    let metadata = data.metadata.find(d => d.id === parseInt(sample));
    let panel = d3.select("#sample-metadata");

    // Clear existing metadata
    panel.html("");

    // Display each key-value pair
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  }

  // Step 5: Populate the dropdown menu with sample IDs
  let dropdown = d3.select("#selDataset");
  data.names.forEach(name => {
    dropdown.append("option").text(name).property("value", name);
  });

// Step 6: Creating the gauge chart
function createGaugeChart(sample) {
  let metadata = data.metadata.find(d => d.id === parseInt(sample));
  let weeklyFrequency = metadata.wfreq;

  let trace = {
    type: "indicator",
    mode: "gauge+number",
    value: weeklyFrequency,
    title: { text: "Weekly Washing Frequency", font: { size: 18 } },
    gauge: {
      axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 1], color: "rgba(0, 105, 11, 0.5)" },
        { range: [1, 2], color: "rgba(10, 120, 22, 0.5)" },
        { range: [2, 3], color: "rgba(14, 127, 0, 0.5)" },
        { range: [3, 4], color: "rgba(110, 154, 22, 0.5)" },
        { range: [4, 5], color: "rgba(170, 202, 42, 0.5)" },
        { range: [5, 6], color: "rgba(202, 209, 95, 0.5)" },
        { range: [6, 7], color: "rgba(210, 206, 145, 0.5)" },
        { range: [7, 8], color: "rgba(232, 226, 202, 0.5)" },
        { range: [8, 9], color: "rgba(240, 230, 215, 0.5)" }
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: weeklyFrequency
      },
      shape: "angular",
      bar: { color: "darkblue" }
    }
  };

  let layout = {
    width: 400,
    height: 300,
    margin: { t: 20, b: 40, l: 40, r: 40 }
  };

  Plotly.newPlot("gauge", [trace], layout);
}

  
  // Helper function to calculate the path of the gauge pointer
  function getPath(value) {
    // Calculate the angle corresponding to the value
    let angle = (180 - (value / 9) * 180) - 45;
  
    // Convert the angle to radians
    let radians = (Math.PI / 180) * angle;
  
    // Calculate the end coordinates of the gauge pointer
    let x = 0.5 - 0.3 * Math.cos(radians);
    let y = 0.5 - 0.3 * Math.sin(radians);
  
    // Create the path
    let path = `M 0.5 0.5 L ${x} ${y} L 0.5 0.88 Z`;
    return path;
  }
  
  // Event handler for dropdown change
  function optionChanged(sample) {
    createBarChart(sample);
    createBubbleChart(sample);
    createGaugeChart(sample);
    displayMetadata(sample);
  }

  // Initial chart creation
  let initialSample = data.names[0];
  createBarChart(initialSample);
  createBubbleChart(initialSample);
  createGaugeChart(initialSample);
  displayMetadata(initialSample);

  // Event listener for dropdown change
  dropdown.on("change", function() {
    let selectedSample = d3.select(this).property("value");
    optionChanged(selectedSample);
  });
}).catch(error => console.log(error));
