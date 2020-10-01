<template>
  <div class="container">
    <div id="loading" style="display:none">Loading....</div>
    <div class="row">
      <div class="colmd-6">
        <input type="file" v-on:change="csvFileInput" accept=".csv" required />
        <button @click="uploadCsvData" style="display:none" id="uploadCsvInput">
          Upload
        </button>
      </div>
      <div class="colmd-6">
        <input type="text" v-model="searchText" required />
        <button @click="searchData" id="uploadCsvInput">
          Search
        </button>
        <button @click="allCars">All</button>
      </div>
    </div>
    <apexchart
      type="pie"
      width="380"
      :options="options"
      :series="series"
    ></apexchart>
    <div class="createCar">
      <input
        type="text"
        name="manufacturer"
        v-model="car.manufacturer"
        placeholder="manufacturer"
      />
      <input type="text" name="model" v-model="car.model" placeholder="model" />
      <input type="text" name="year" v-model="car.year" placeholder="year" />
      <input
        type="text"
        name="country"
        v-model="car.country"
        placeholder="country"
      />
      <button @click="insertCar">Insert/Update</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Manufacturer</th>
          <th>Model</th>
          <th>Year</th>
          <th>Country</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.manufacturer }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.year }}</td>
          <td>{{ car.country }}</td>
          <td>
            <button @click="editCar(car)">Edit</button
            ><button @click="deleteCar(car._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <span class="text-success">Total Cars: {{ pagination.numOfResults }}</span>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li
          v-bind:class="[
            'page-item',
            index == pagination.currentPage ? 'active' : '',
          ]"
          v-for="index in pagination.pages"
          :key="index"
        >
          <a class="page-link" href="#" @click="paginateCar(index)">{{
            `${index}`
          }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import CarService from "../CarService";

export default {
  name: "CarComponent",

  data() {
    return {
      csvString: null,
      cars: [],
      car: {
        id: 0,
        manufacturer: "",
        model: "",
        year: "",
        country: "",
      },
      error: "",
      options: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [],
      },
      series: [],
      searchText: "",
      page: "",
      pagination: { currentPage: 1, numOfResults: 0, pages: 0, searchVal: "" },
    };
  },
  mounted() {
    this.getCars();
  },
  methods: {
    async getCars() {
      try {
        document.getElementById("loading").style.display = "block";
        const {
          cars,
          currentPage,
          numOfResults,
          pages,
          searchVal,
        } = await CarService.getCars(this.searchText, this.page);

        this.cars = cars;
        this.pagination = { currentPage, numOfResults, pages, searchVal };
        this.generateChart(this.cars);
        document.getElementById("loading").style.display = "none";
      } catch (err) {
        this.error = err.message;
      }
    },
    paginateCar(page) {
      this.page = page;
      this.getCars();
    },
    csvFileInput(e) {
      this.cavToJson(e.target.files[0]);
    },
    async uploadCsvData() {
      try {
        document.getElementById("loading").style.display = "block";
        await CarService.csvString(this.csvString);
        this.page = "";
        (this.searchText = ""), this.getCars();
      } catch (err) {
        this.error = err.message;
      }
    },
    async insertCar() {
      if (this.car.id != 0) {
        this.updateCarData();
        return;
      }
      document.getElementById("loading").style.display = "block";
      await CarService.insertCar(this.car);
      this.car = {};
      this.page = "";
      (this.searchText = ""), this.getCars();
    },
    async updateCarData() {
      document.getElementById("loading").style.display = "block";
      const updatedCar = await CarService.editCar(this.car);

      this.cars = this.cars.map((car) => {
        if (car.id == this.car) {
          car = updatedCar;
          return car;
        }
        return car;
      });
      this.car = {};
      document.getElementById("loading").style.display = "none";
    },
    async deleteCar(id) {
      document.getElementById("loading").style.display = "block";
      await CarService.deleteCar(id);
      this.getCars();
    },
    generateChart(cars) {
      let carChart = {};
      cars.map((car) => {
        carChart[car.manufacturer] =
          carChart[car.manufacturer] !== undefined
            ? carChart[car.manufacturer] + 1
            : 1;
      });
      this.series = Object.keys(carChart).map((k) => {
        return carChart[k];
      });
      this.options = {
        ...this.options,
        labels: Object.keys(carChart),
      };
    },
    cavToJson(csv) {
      var fileReader = new FileReader();
      fileReader.readAsText(csv);
      fileReader.onload = (e) => {
        const csvData = e.target.result;
        var lines = csvData.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
          }
          result.push(obj);
        }

        this.csvString = JSON.stringify(result);
        document.getElementById("uploadCsvInput").style.display = "block";
      };
    },
    async searchData() {
      if (this.searchText != "") {
        try {
          document.getElementById("loading").style.display = "block";
          this.page = "";
          this.getCars();
        } catch (err) {
          this.error = err.message;
        }
      }
    },
    editCar(car) {
      this.car = car;
    },
    allCars() {
      window.location.replace("/");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#loading {
  position: fixed;
  top: 40%;
  left: 40%;
  padding: 20px;

  background-color: aqua;
}
</style>
