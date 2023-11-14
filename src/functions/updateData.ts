import axios from "axios";
import { backEndUrl } from "../config.ts";

export default async function updateData() {
  await axios.get(backEndUrl + "/csv/all").then((response) => {
    console.log(response);
  });
}
