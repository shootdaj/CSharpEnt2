using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi
{
	public class Listing
	{
		public int ID { get; set; }

		public string Company { get; set; }

		public string Model { get; set; }

		public int MemoryInGB { get; set; }

		public int CPUSpeedInGHz { get; set; }

		public int Cores { get; set; }

		public int CostInDollars { get; set; }
	}
}
