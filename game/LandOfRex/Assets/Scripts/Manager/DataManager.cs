using System.Collections.Generic;
using UnityEngine;

public class DataManager : MonoBehaviour
{
    public bool isDay = true;
    public int gold = 0;

    public List<Transform> buildings = new List<Transform>();
    public List<Transform> enemys = new List<Transform>();
    public Dictionary<int, List<Transform>> units = new Dictionary<int, List<Transform>>();
}
