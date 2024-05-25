import Localbase from "localbase";
import QuestionData, { version } from "./QuestionList";

const db = new Localbase("db");
db.config.debug = false;

const localVersion = localStorage.getItem("DsaVersion");

function saveVersionAndReload(newVersion) {
  localStorage.setItem("DsaVersion", newVersion);
  setTimeout(() => window.location.reload(), 3000);
}

function updateTopicQuestions(topic, dataFromJSON) {
  topic.questions.forEach((qObj, index) => {
    if (index < dataFromJSON.length) {
      dataFromJSON[index] = {
        ...dataFromJSON[index],
        Done: qObj.Done || false,
      };
    }
  });
}

function generateKey(topicName) {
  return topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
}

export function insertData(callback) {
  QuestionData.forEach((topic) => {
    const key = generateKey(topic.topicName);
    db.collection("dsaArchive").add(topic, key);
  });
  getData(callback);
}

export function getData(callback) {
  db.collection("dsaArchive").get().then((data) => {
    if (data.length === 0) {
      insertData(callback);
    } else {
      data.sort((a, b) => a.position - b.position);

      if (!localVersion) {
        saveVersionAndReload(100000000);
      }

      if (parseInt(localVersion) !== version) {
        data.forEach((topic, index) => {
          const dataFromJSON = QuestionData[index].questions;
          const key = generateKey(topic.topicName);

          updateTopicQuestions(topic, dataFromJSON);

          db.collection("dsaArchive").doc(key).update({
            started: topic.started,
            doneQuestions: topic.doneQuestions,
            questions: dataFromJSON,
          });
        });
        saveVersionAndReload(version);
      } else {
        callback(data);
      }
    }
  });
}

export function getTopicData(topicName, callback) {
  const key = generateKey(topicName);
  db.collection("dsaArchive").doc(key).get().then(callback);
}

export function updateDBData(topicName, updateData) {
  const key = generateKey(topicName);
  db.collection("dsaArchive").doc(key).update(updateData);
}
