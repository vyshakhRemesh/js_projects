document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const MAX_IMAGES = 5;
  const imageUpload = document.getElementById("imageUpload");
  const deleteButton = document.getElementById("delete");
  const deleteAllButton = document.getElementById("deleteAll");
  const descriptionInput = document.getElementById("description");

  // Display stored images from local storage when the page loads
  let storedList = getStoredList() != null ? getStoredList() : [];
  displayFiles(storedList);

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log(e.dataTransfer.files);
    const file = e.dataTransfer.files[0];
    addNewFile(file);
  });

  imageUpload.addEventListener("change", handleFileUpload);

  function handleFileUpload(e) {
    console.log(e);
    const file = e.target.files[0];
    addNewFile(file);
  }

  async function addNewFile(file) {
    if (!file) return;
    console.log(`the file type you added is ${typeof file}`);
    console.log("the file to add is ", file);

    //convert the blob file to base64
    const base64String = await blobToBase64(file);
    console.log(`the base64string is ${base64String}`);

    // const storedList = getStoredList();
    console.log(`the stored list is`, storedList);

    storedList.push({ file: base64String, name: file.name });
    console.log("the list to save is", storedList);

    saveToLocalStorage(storedList);

    displayFiles(storedList);
  }

  function getStoredList() {
    const storedData = localStorage.getItem("storedListArray");
    console.log("stored data:", JSON.parse(storedData));
    return JSON.parse(storedData || "[]");
  }

  function saveToLocalStorage(list) {
    localStorage.setItem("storedListArray", JSON.stringify(list));
  }

  //function to display the images in storedList
  function displayFiles(list) {
    console.log("entered the display function", list);
    fileList.innerHTML = ""; // Clear existing images before displaying from local storage
    for (const item of list) {
      // console.log(`the list.file is ${item.file}`);

      const blobFile = base64ToBlob(item.file);
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.classList.add("mediumImage");
        img.src = e.target.result;
        img.alt = item.name; // Assuming file.name is available, adjust as needed
        // img.style.height = "500px";
        // img.style.width = "500px";
        fileList.appendChild(img);
      };
      reader.readAsDataURL(blobFile);
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result;
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  }

  /*********************************************************** */

  function base64ToBlob(base64String, mimeType) {
    mimeType = mimeType || "";

    // Split the base64 string into two parts
    const parts = base64String.split(";base64,");
    const contentType = parts[0].split(":")[1];

    // Decode the base64 string
    const decodedData = atob(parts[1]);

    // Create a typed array
    const uInt8Array = new Uint8Array(decodedData.length);

    // Copy the decoded data to the typed array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Create a blob using the typed array and mime type
    return new Blob([uInt8Array], { type: mimeType || contentType });
  }

  //delete button eventhandler
  deleteButton.addEventListener("click", () => {
    console.log("delete button presssed");
    storedList.pop();
    console.log(storedList);
    saveToLocalStorage(storedList);

    displayFiles(storedList);
  });

  //delete all
  deleteAllButton.addEventListener("click", () => {
    localStorage.clear();
    storedList = getStoredList();
    displayFiles(storedList);
  });
});
