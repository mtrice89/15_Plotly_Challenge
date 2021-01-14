//This function creates a bar chart with the top 10 OTUs
function barChart(incomingData) {
    console.log(incomingData)
    //Using map object to create an array of OTUs then slice to get top 10
    let otu_Ids = incomingData.otu_ids.map(function (otu) {
        return 'OTU ' + otu
    })
    let sliced_otu_Ids = otu_Ids.slice(0, 10)
    // console.log(sliced_otu_Ids)

    //Storing sample values & labels into variables
    let values = incomingData.sample_values.slice(0, 10)
    let otu_label = incomingData.otu_labels

    //Setting up trace, layout, & Plotly bar chart
    let trace = {
        x: values.reverse(),
        y: sliced_otu_Ids.reverse(),
        text: otu_label.reverse(),
        type: 'bar',
        orientation: 'h'
    }
    let barData = [trace]
    let layout = {
        title: 'Top 10 OTUs',
        width: 850
    }
    Plotly.newPlot("bar", barData, layout)
}

//This function creates a bubble chart with all OTUs
function bubbleChart(incomingData) {
    //Storing sample values, labels, & Ids into variables
    let values = incomingData.sample_values
    let otu_label = incomingData.otu_labels
    let otu_Ids = incomingData.otu_ids

    //Setting up trace, layout, & Plotly bubble chart
    let trace = {
        x: otu_Ids,
        y: values,
        text: otu_label,
        mode: 'markers',
        marker: {
            color: otu_Ids,
            size: values
        }
    }
    let bubbleData = [trace]
    let layout = {
        title: 'Bacteria',
        xaxis: { title: "" },
        yaxis: values,
        showlegend: false,
        height: 600,
        width: 1000
    }
    Plotly.newPlot('bubble', bubbleData, layout);
}

//This function populates the Demographic Info
function idData(incomingData) {
    //Reference to the html Demographic Info box
    let ul = d3.select('#sample-metadata')
    //Clears out data so new id can fillin
    ul.html('')
    //Gets the demographic data for the id selected, appends info to demographic info box
    Object.entries(incomingData).forEach(([keys, value]) => {
        ul.append('h5').text(`${keys} : ${value}`)
    })
}


//This function populates the dropdown list & displays first id in data
function initial () {
    //Reference to the html dropdown id
    let dropdown = d3.select('#selDataset')

    //Append list of ids to the dropdown
    d3.json('samples.json').then(function (data) {
        data.names.forEach(subject => {
            dropdown.append('option').text(subject).property('value', subject)
        })

        //Setting up inital data
        let initialData = data.samples[0]
        //Setting up inital data for Demographic Info
        let metadata = data.metadata[0]
        console.log(data)
        // console.log(initialData)
        // console.log(metadata)

        //Calling functions
        barChart(initialData)
        bubbleChart(initialData)
        idData(metadata)
    })
}
//Calling inital function, sets up the initial view (first id in data)
initial()


//This function is for the changed event, gets new data each time a new id is selected
function optionChanged(idNumber) {
    d3.json("samples.json").then(function (data) {
        let filteredData = data.samples.filter(item => item.id == idNumber)
        // console.log(filteredData)
        barChart(filteredData[0])
        bubbleChart(filteredData[0])
        let barfilteredmeta = data.metadata.filter(item => item.id == idNumber)
        idData(barfilteredmeta[0])
    })
}