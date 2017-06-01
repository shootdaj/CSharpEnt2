using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
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
		
		public dynamic Post([FromBody]object inventory)
		{
			var text = JsonConvert.SerializeObject(inventory);
			File.WriteAllText("data.json", text);

			var data = JObject.Parse(File.ReadAllText("data.json"));
			return data;
		}
	}
}
