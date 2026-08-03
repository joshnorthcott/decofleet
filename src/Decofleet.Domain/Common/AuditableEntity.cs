namespace Decofleet.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public Guid? CreatedById { get; set; }
    public Guid? UpdatedById { get; set; }
}
