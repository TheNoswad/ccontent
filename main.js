var url = "http://scresdir.appspot.com/resource";
        var cors_url = "https://cors-anywhere.herokuapp.com/http://scresdir.appspot.com/resource";
        var nextcursor = "";

        var sortorder = ""
        var itemsfilter = ""

        // FIX STAR CLIPPING

        // Sort order: ByTime

        document.onload = loadXMLDoc();

        /* When the user clicks on the button, 
        toggle between hiding and showing the dropdown content */
        function sortOrderDropdownButtonClicked(dropdownname) {
            document.getElementById("sortOrderDropdown").classList.toggle("show");
        };

        /* When the user clicks on the button, 
        toggle between hiding and showing the dropdown content */
        function itemFilterDropdownButtonClicked(dropdownname) {
            document.getElementById("typeDropdown").classList.toggle("show");
        };

        // Close the dropdown if the user clicks outside of it
        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn, .dropbtnright')) {
                var dropdowns = document.querySelectorAll(".dropdown-content, .dropdown-content-right");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        };

        function generateStars(rating) {
            var fullstar = '<img class="fullstar" src="RatingStar.png">';
            var halfstar = '<img class="halfstar" src="RatingStar.png">';
            var numfullstars = rating.charAt(0);
            var numhalfstars = rating.charAt(2);
            var result = "";

            // Add a full star for each thing
            for (var i = 0; i < numfullstars; i++) {
                result += fullstar
            }
            console.log(numhalfstars);
            if (numhalfstars == 5) {
                result += halfstar
            }

            return result
        };

        function changeSortOrder(neworder) {
            if (neworder == sortorder) {
                console.log("Sortorder is already set to " + neworder);
            }
            else {
                sortorder = neworder
                // Clear the list
                document.getElementById("list").innerHTML = "";
                nextcursor = ""
                loadXMLDoc();
                updateFill()
            }
        }

        function changeItemsFilter(newitemsfilter) {
            if (newitemsfilter == itemsfilter) {
                console.log("Itemsfilter is already set to " + newitemsfilter);
            }
            else {
                itemsfilter = newitemsfilter
                // Clear the list
                document.getElementById("list").innerHTML = "";
                nextcursor = ""
                loadXMLDoc();
                updateFill()
            }
        }

        function loadXMLDoc() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                var status = xhttp.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // document.getElementById("demo").innerHTML =
                    //     this.responseText;
                    console.log(this.responseXML);
                    setList(this)
                }
                else {
                    alert("This page requires the CORS Anywhere proxy. Enable it at https://cors-anywhere.herokuapp.com/");
                    window.open("https://cors-anywhere.herokuapp.com/", "_blank")
                }
            };

            xhttp.open("POST", cors_url, true);

            //Send the proper header information along with the request
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.overrideMimeType('application/xml');

            var stufftosend = "Action=list";

            // Set the cursor
            if (nextcursor != "") {
                stufftosend += "&Cursor=" + nextcursor
            }

            // Set the sort order type
            if (sortorder != "") {
                stufftosend += "&SortOrder=" + sortorder
            }

            // Set the item filter
            if (itemsfilter != "") {
                stufftosend += "&Type=" + itemsfilter
            }

            console.log(stufftosend);

            xhttp.send(stufftosend)
        };

        // Checks if the user has scrolled to the bottom of the window.
        window.onscroll = function () {
            var d = document.documentElement;
            var offset = d.scrollTop + window.innerHeight;
            var height = d.offsetHeight;

            //console.log('offset = ' + offset);
            //console.log('height = ' + height);

            if (offset >= height) {
                console.log('At the bottom');
                loadXMLDoc();
                updateFill()
            }
        };

        // Checks for whitespece on page load. Hacky fix for mobile
        window.onload = updateFill();

        function updateFill() {
            var d = document.documentElement;
            var offset = d.scrollTop + window.innerHeight;
            var height = d.offsetHeight;

            //console.log('offset = ' + offset);
            //console.log('height = ' + height);

            if (offset >= height) {
                console.log('At the bottom');
                loadXMLDoc()
            }
        };

        // Sets the contents of the list
        function setList(xml) {
            var i;
            var xmlDoc = xml.responseXML;
            var list = "";

            // Get the next cursor and store it
            nextcursor = xmlDoc.getElementsByTagName("Results")[0].getAttribute("NextCursor")
            console.log(nextcursor);

            // Get all the data from the request
            var x = xmlDoc.getElementsByTagName("Result");

            // Itterate over the xml and add them to the button array
            for (i = 0; i < x.length; i++) {
                // Generate the stars code for the thing
                var stars = generateStars(x[i].getAttribute("RatingsAverage"));

                list += "<button " +
                    "onclick=location.href='" +
                    x[i].getAttribute("Url") +
                    "' type='button'>" +
                    x[i].getAttribute("Name") +
                    "<br>" +

                    // Add the item icon
                    "<img class='itemicon' src='" + x[i].getAttribute("Type") + "Icon.png'>" +

                    // Add the "ExtraText" to the bottom
                    "<div style='font-size: small;'>" + stars +
                    x[i].getAttribute("ExtraText") +
                    "<div>" +
                    "</button>";
            }
            document.getElementById("list").innerHTML += list;
        }