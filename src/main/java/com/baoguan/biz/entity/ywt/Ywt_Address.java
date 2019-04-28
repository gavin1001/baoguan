package com.baoguan.biz.entity.ywt;

public class Ywt_Address {

	
	private int id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	private String content;
	private String countrySubEntityID;
	private String referType;
	private String cityName;
	private String countryCode;
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getCountrySubEntityID() {
		return countrySubEntityID;
	}
	public void setCountrySubEntityID(String countrySubEntityID) {
		this.countrySubEntityID = countrySubEntityID;
	}
	public String getReferType() {
		return referType;
	}
	public void setReferType(String referType) {
		this.referType = referType;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getCountryCode() {
		return countryCode;
	}
	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}
	public String getTypeCode() {
		return typeCode;
	}
	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}
	public String getPostcodeID() {
		return postcodeID;
	}
	public void setPostcodeID(String postcodeID) {
		this.postcodeID = postcodeID;
	}
	public String getLine() {
		return line;
	}
	public void setLine(String line) {
		this.line = line;
	}
	public int getReferId() {
		return referId;
	}
	public void setReferId(int referId) {
		this.referId = referId;
	}
	public String getCountrySubEntityName() {
		return countrySubEntityName;
	}
	public void setCountrySubEntityName(String countrySubEntityName) {
		this.countrySubEntityName = countrySubEntityName;
	}
	private String typeCode;
	private String postcodeID;
	private String line;
	private int referId;
	private String countrySubEntityName;
	
}
