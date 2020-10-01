import axios from "axios";
const url = "api/cars/";

class CarService {
  // Get Car
  static getCars(query, page) {
    return new Promise((resolve, reject) => {
      try {
        let queryUrl =
          query != null ? `${url}?search=${query}&page=${page}` : url;
        console.log(queryUrl);
        axios.get(queryUrl).then((res) => {
          resolve(res.data);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Upload CSV String
  static csvString(str) {
    return new Promise((resolve, reject) => {
      try {
        axios.post(`${url}csvstring`, JSON.parse(str)).then((res) => {
          const data = res.data;
          resolve(data);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  // Create Car
  static insertCar(car) {
    return axios.post(url, car);
  }
  // Edit Car
  static editCar(car) {
    return new Promise((resolve, reject) => {
      try {
        axios.put(url, car).then((res) => {
          const data = res.data;
          resolve(data);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  // Delete Car
  static deleteCar(id) {
    return axios.delete(`${url}${id}`);
  }
}

export default CarService;
