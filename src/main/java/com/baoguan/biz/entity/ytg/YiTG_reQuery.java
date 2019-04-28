package com.baoguan.biz.entity.ytg;/**
 * Function: <br/>
 * REASON: <br/>
 * VERSION: 4.0
 *
 * @Auther: zhangyang
 * @Date: 2019/3/7.
 */

/**
 * File Name:YiTG_reQuery  
 * @Description 易通关通过集装箱号查询后返回的entity
 * Date:2019/3/7 11:37  
 * @author zhangyang
 * @Version 4.0
 * Copyright (c) 2019,  All Rights Reserved.  
 */
public class YiTG_reQuery {
    private String status;
    private String bookingno;
    private String sealNumber;
    private String vesselEnFromMaTou;
    private String voyageCodeFromMaTou;
    private String carrierId;
    private String contaType;
    private String startSectionNo;
    private String endSectionNo;
    private String isAuthorize;
    private String isAutoSectionNo;
    private String agency;

    public String getStartSectionNo() {
        return startSectionNo;
    }

    public void setStartSectionNo(String startSectionNo) {
        this.startSectionNo = startSectionNo;
    }

    public String getEndSectionNo() {
        return endSectionNo;
    }

    public void setEndSectionNo(String endSectionNo) {
        this.endSectionNo = endSectionNo;
    }

    public String getIsAuthorize() {
        return isAuthorize;
    }

    public void setIsAuthorize(String isAuthorize) {
        this.isAuthorize = isAuthorize;
    }

    public String getIsAutoSectionNo() {
        return isAutoSectionNo;
    }

    public void setIsAutoSectionNo(String isAutoSectionNo) {
        this.isAutoSectionNo = isAutoSectionNo;
    }

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBookingno() {
        return bookingno;
    }

    public void setBookingno(String bookingno) {
        this.bookingno = bookingno;
    }

    public String getSealNumber() {
        return sealNumber;
    }

    public void setSealNumber(String sealNumber) {
        this.sealNumber = sealNumber;
    }

    public String getVesselEnFromMaTou() {
        return vesselEnFromMaTou;
    }

    public void setVesselEnFromMaTou(String vesselEnFromMaTou) {
        this.vesselEnFromMaTou = vesselEnFromMaTou;
    }

    public String getVoyageCodeFromMaTou() {
        return voyageCodeFromMaTou;
    }

    public void setVoyageCodeFromMaTou(String voyageCodeFromMaTou) {
        this.voyageCodeFromMaTou = voyageCodeFromMaTou;
    }

    public String getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(String carrierId) {
        this.carrierId = carrierId;
    }

    public String getContaType() {
        return contaType;
    }

    public void setContaType(String contaType) {
        this.contaType = contaType;
    }

    public String getContaTypeCnName() {
        return contaTypeCnName;
    }

    public void setContaTypeCnName(String contaTypeCnName) {
        this.contaTypeCnName = contaTypeCnName;
    }

    public String getDeptCustCode() {
        return deptCustCode;
    }

    public void setDeptCustCode(String deptCustCode) {
        this.deptCustCode = deptCustCode;
    }

    public String getDeptCustNameEn() {
        return deptCustNameEn;
    }

    public void setDeptCustNameEn(String deptCustNameEn) {
        this.deptCustNameEn = deptCustNameEn;
    }

    public String getShipNameEn() {
        return shipNameEn;
    }

    public void setShipNameEn(String shipNameEn) {
        this.shipNameEn = shipNameEn;
    }

    public String getShipId() {
        return shipId;
    }

    public void setShipId(String shipId) {
        this.shipId = shipId;
    }

    public String getDeclareOutDate() {
        return declareOutDate;
    }

    public void setDeclareOutDate(String declareOutDate) {
        this.declareOutDate = declareOutDate;
    }

    public String getDocSender() {
        return docSender;
    }

    public void setDocSender(String docSender) {
        this.docSender = docSender;
    }

    public String getVoyNo() {
        return voyNo;
    }

    public void setVoyNo(String voyNo) {
        this.voyNo = voyNo;
    }

    public String getImocode() {
        return imocode;
    }

    public void setImocode(String imocode) {
        this.imocode = imocode;
    }

    public String getDischPort() {
        return dischPort;
    }

    public void setDischPort(String dischPort) {
        this.dischPort = dischPort;
    }

    public String getsType() {
        return sType;
    }

    public void setsType(String sType) {
        this.sType = sType;
    }

    public String getCutoffDate() {
        return cutoffDate;
    }

    public void setCutoffDate(String cutoffDate) {
        this.cutoffDate = cutoffDate;
    }

    public String getLoadingDate() {
        return loadingDate;
    }

    public void setLoadingDate(String loadingDate) {
        this.loadingDate = loadingDate;
    }

    private String contaTypeCnName;
    private String deptCustCode;
    private String deptCustNameEn;
    private String shipNameEn;
    private String shipId;
    private String declareOutDate;
    private String docSender;
    private String voyNo;
    private String imocode;
    private String dischPort;
    private String sType;
    private String cutoffDate;
    private String loadingDate;


    @Override
    public String toString() {


        return super.toString();
    }
}
