package com.baoguan.biz.entity.ywt;
/**
 * 
 * ClassName: Communication <br/>  
 * Function: TODO ADD FUNCTION. <br/>  
 * Reason: TODO ADD REASON(可选). <br/>  
 * date: 2019年4月28日 上午11:22:00 <br/>  
 *  
 * @author zhangyang  
 * @version   
 * @since JDK 1.8
 */
public class Ywt_Communication {

	
	private int id;
	private int personId;
	private String code;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPersonId() {
		return personId;
	}
	public void setPersonId(int personId) {
		this.personId = personId;
	}
	private String typeId;
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	
	
}
