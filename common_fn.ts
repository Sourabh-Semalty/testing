import fs from "fs";

// Function to check if a file exists
export function checkFileExists(fileName: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    fs.access(fileName, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist
        resolve(false);
      } else {
        // File exists
        resolve(true);
      }
    });
  });
}

// Function to write JSON data to file
export function writeJsonToFile(
  fileName: string,
  jsonData: any
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function writeEmailToFile(
  fileName: string,
  emailId: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.appendFile(fileName, emailId + "\n", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function readFilesWithSubstring(substring: any) {
  return new Promise((resolve, reject) => {
    fs.readdir("./prod_json_data", (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(substring);
      const filteredFiles = files
        .filter((fileName) => fileName.includes(substring))
        .map((fileName) => `./prod_json_data/${fileName}`);
      console.log("filterFiles", filteredFiles);

      Promise.all(
        filteredFiles.map((fileName) => {
          return new Promise((resolveFile, rejectFile) => {
            fs.readFile(fileName, "utf8", (errFile, data) => {
              if (errFile) {
                rejectFile(errFile);
              } else {
                const jsonData = JSON.parse(data);
                resolveFile({ fileName, data: jsonData });
              }
            });
          });
        })
      )
        .then((fileContents) => resolve(fileContents))
        .catch((error) => reject(error));
    });
  });
}

export function getAllContacts(jsonData: any) {
  const allContacts: any = [];
  jsonData.forEach((obj: any) => {
    obj.data.forEach((innerArray: any) => {
      innerArray.forEach((contactObj: any) => {
        if (contactObj.contact) {
          allContacts.push(contactObj.contact);
        }
      });
    });
  });
  return allContacts;
}
