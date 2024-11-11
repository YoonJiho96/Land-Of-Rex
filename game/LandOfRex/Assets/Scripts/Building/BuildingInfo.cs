using UnityEngine;

public class BuildingInfo : MonoBehaviour
{
    public string buildingName;
    public int health;
    public int attackPower; // 0으로 설정 시 표시 안 함
    public float range;     // 0.0f로 설정 시 표시 안 함
    public string specialEffect; // 빈 문자열로 설정 시 표시 안 함
}
