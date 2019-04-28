package com.baoguan.biz.entity.ywt;

import java.util.List;

public class Ywt_PersonInfo {

	
	private int id;
	private String aeo;
	private Ywt_Address address;
	private String referType;
	private String name;
	private String typeCode;
	private String code;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	private List<Ywt_Communication> communicationList;
	private String referId;
	private String contactPerson;
	public String getAeo() {
		return aeo;
	}
	public void setAeo(String aeo) {
		this.aeo = aeo;
	}
	public Ywt_Address getAddress() {
		return address;
	}
	public void setAddress(Ywt_Address address) {
		this.address = address;
	}
	public String getReferType() {
		return referType;
	}
	public void setReferType(String referType) {
		this.referType = referType;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTypeCode() {
		return typeCode;
	}
	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public List<Ywt_Communication> getCommunicationList() {
		return communicationList;
	}
	public void setCommunicationList(List<Ywt_Communication> communicationList) {
		this.communicationList = communicationList;
	}
	public String getReferId() {
		return referId;
	}
	public void setReferId(String referId) {
		this.referId = referId;
	}
	public String getContactPerson() {
		return contactPerson;
	}
	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}
}
