using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json.Linq;

namespace WebApi
{
	public class ListingsController : ApiController
	{
		public dynamic Get()
		{
			var data = JObject.Parse(File.ReadAllText("data.json"));
			return data;
		}
		
		public void Post([FromBody]string value)
		{
		}
		
		
		// DELETE api/values/5 
		public void Delete(int id)
		{
		}
	}
}
