function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var md_url = `/metadata/${sample}`;
  d3.json(md_url).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
     var metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
        Object.entries(data).forEach(([key, value]) => {
         var row = metadata.append("p");
         row.text(`${key}: ${value}`
          );
        })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
	})
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sd_url= `/samples/${sample}`;
 
 d3.json(sd_url).then((function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var bc_ids = data.otu_ids;
    var bc_labels = data.otu_labels;
    var chart_values = data.sample_values;

      var bc_data =  {
      mode: 'markers',
      x: bc_ids,
      y: chart_values,
      text: bc_labels,
      marker: {color: bc_ids, colorscale: "Earth", size: chart_values}
    };
    var data1 = [bc_data];
    // @TODO: Build a Pie Chart

     var chart_layout = {
        title: 'Bacteria Distribution Breakdown',
        showlegend: true,
        height: 600,
        width : 600
      };
  Plotly.newPlot("bubble", data1, chart_layout);

	}))
};
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json('/samples/${sample}').then(function(data) {
    var ten_sample_ids = data.otu_ids.slice(0,10);
    var ten_sample_labels = data.otu_labels.slice(0,10);
    var ten_sample_values = data.sample_values.slice(0,10);

    var ten_sample_data = [{
      "labels" : ten_sample_ids,
      "values" : ten_sample_values,
      "hovertext" : ten_sample_labels,
      "type" : "pie"
  }]
var data2 = [ten_sample_data];
  Plotly.newPlot('pie', data2, chart_layout);
  });
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();