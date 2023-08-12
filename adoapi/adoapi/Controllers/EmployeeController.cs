using adoapi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace adoapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public EmployeeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("GetEmployees")]
        public List<Employee> GetEmployees()
        {
            List<Employee> employees=new List<Employee>();
            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            SqlCommand cmd = new SqlCommand("Select * from empData1", con);
            SqlDataAdapter da= new SqlDataAdapter(cmd);
            DataTable dt= new DataTable();
            da.Fill(dt);
            for(int i=0; i<dt.Rows.Count;i++)
            {
                Employee employeeObj = new Employee();
                employeeObj.ID = int.Parse(dt.Rows[i]["ID"].ToString());
                employeeObj.Age = int.Parse(dt.Rows[i]["Age"].ToString());
                employeeObj.EName=Convert.ToString(dt.Rows[i]["EName"]);
                employees.Add(employeeObj);
            }

            return employees;
        }
        [HttpPost]
        [Route("AddEmployee")]
        public string AddEmployee(Employee employee)
        {
            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            SqlCommand cmd = new SqlCommand("INSERT INTO empData1 (EName, Age) VALUES (@EName, @Age)", con);
            cmd.Parameters.AddWithValue("@EName", employee.EName);
            cmd.Parameters.AddWithValue("@Age", employee.Age);
            con.Open();
            cmd.ExecuteNonQuery();
            con.Close();
            return "Product Saved Successfully";
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            SqlCommand cmd = new SqlCommand("DELETE FROM empData1 WHERE ID = @Id", con);
            cmd.Parameters.AddWithValue("@Id", id);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            con.Close();

            if (rowsAffected > 0)
            {
                return Ok("Employee deleted successfully.");
            }
            else
            {
                return NotFound("Employee not found.");
            }
        }
        [HttpPut("{id}")]
        public IActionResult EditEmployee(int id, Employee employee)
        {
            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            SqlCommand cmd = new SqlCommand("UPDATE empData1 SET EName = @EName, Age = @Age WHERE ID = @Id", con);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@EName", employee.EName);
            cmd.Parameters.AddWithValue("@Age", employee.Age);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            con.Close();

            if (rowsAffected > 0)
            {
                return Ok("Employee updated successfully.");
            }
            else
            {
                return NotFound("Employee not found.");
            }
        }

    }
}
