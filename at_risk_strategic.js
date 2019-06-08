looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "at_risk_strategic",
  label: "At Risk Strategic",
  options: {
    font_size: {
      type: "string",
      label: "Font Size",
      values: [
        {"Large": "large"},
        {"Small": "small"}
      ],
      display: "radio",
      default: "large"
    }
  },
  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
       .at-risk-strategic-vis {
        height: 100%;
        display: grid;
      }
      .at-risk-strategic-image {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 3;
        margin-left: 5%;
      }
      .distinct-shopper-count {
        font-size: 20px;
        grid-column-start: 2;
        grid-column-end: 3;
        grid-row-start: 2;
        grid-row-end: 3;
        margin-left: 5%;
        margin-top: -5%;
      }
      .blank-div {
        grid-column-start: 3;
        grid-column-end: 6;
        grid-row-start: 1;
        grid-row-end: 3;
      }
      </style>
    `;

    // Create a container element to let us center the text.
    var container = element.appendChild(document.createElement("div"));
    container.className = "at-risk-strategic-vis";

    var c1 = element.appendChild(document.createElement("div"));

    container.appendChild(c1);

    // Create an element to contain the corresponding heatmap image.
    this._imageElement = container.appendChild(document.createElement("div"));
    this._imageElement.innerHTML = "<img src=\"https://i.ibb.co/M7pzDpn/At-Risk-Strategic.png\" width=\"200px\" height=\"80px\">";
    this._imageElement.className =  "at-risk-strategic-image";

    // TODO: Determine desired styling and if additional title needs to be included or removed
    // this._nameElement = container.appendChild(document.createElement("p"));
    // this._nameElement.innerHTML = "At Risk Strategic";

    // Create an element to contain the number of distinct shopper ids.
    this._numberElement = container.appendChild(document.createElement("p"));

    // Creates a blank element to help with spacing issues.
    this._blankElement = container.appendChild(document.createElement("div"));
    this._blankElement.className = "blank-div";
    
  },
  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {

    // Clear any errors from previous updates
    this.clearErrors();

    // Log the queryResponse to console to display results returned
    console.log(queryResponse);

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.table_calculations.length == 0) {
      this.addError({title: "No Table Calculations", message: "This chart requires table calculations."});
      return;
    }

    // Grab the first cell of the data
    var firstRow = data[0];
    var firstCell = firstRow[queryResponse.fields.table_calculations[0].name];

    // Insert the data into the page
    this._numberElement.innerHTML = LookerCharts.Utils.htmlForCell(firstCell);

    // Set the size to the user-selected size
    if (config.font_size == "small") {
      this._numberElement.className = "hello-world-text-small";
    } else {
      this._numberElement.className = "distinct-shopper-count";
    }

    // We are done rendering! Let Looker know.
    done()
  }
});
